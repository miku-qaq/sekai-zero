/**
 * Minimal readers for the two Steam cache formats used by the collection sync.
 *
 * They intentionally expose only metadata needed by this project. Account
 * tokens and other values present in Steam's cache never leave this module.
 */

const APPINFO_V41_MAGIC = 0x07564429;
const FIXED_APP_HEADER_BYTES = 60;

function readNullTerminatedString(buffer, start, limit = buffer.length) {
  const end = buffer.indexOf(0, start);
  if (end < 0 || end >= limit) throw new Error("Invalid null-terminated Steam string");
  return { value: buffer.toString("utf8", start, end), next: end + 1 };
}

function readWideString(buffer, start, limit) {
  let end = start;
  while (end + 1 < limit && (buffer[end] !== 0 || buffer[end + 1] !== 0)) end += 2;
  if (end + 1 >= limit) throw new Error("Invalid null-terminated Steam wide string");
  return { value: buffer.toString("utf16le", start, end), next: end + 2 };
}

function readStringTable(buffer, offset) {
  const count = buffer.readUInt32LE(offset);
  const strings = [];
  let cursor = offset + 4;

  for (let index = 0; index < count; index += 1) {
    const entry = readNullTerminatedString(buffer, cursor);
    strings.push(entry.value);
    cursor = entry.next;
  }

  return strings;
}

function parseBinaryObject(buffer, start, end, stringTable) {
  const object = {};
  let cursor = start;

  while (cursor < end) {
    const valueType = buffer.readUInt8(cursor);
    cursor += 1;
    if (valueType === 0x08) return { value: object, next: cursor };
    if (cursor + 4 > end) throw new Error("Truncated Steam binary VDF key");

    const keyIndex = buffer.readUInt32LE(cursor);
    cursor += 4;
    const key = stringTable[keyIndex];
    if (key === undefined)
      throw new Error(`Unknown Steam string-table key ${keyIndex}`);

    let parsed;
    switch (valueType) {
      case 0x00:
        parsed = parseBinaryObject(buffer, cursor, end, stringTable);
        break;
      case 0x01:
        parsed = readNullTerminatedString(buffer, cursor, end);
        break;
      case 0x02:
        parsed = { value: buffer.readInt32LE(cursor), next: cursor + 4 };
        break;
      case 0x03:
        parsed = { value: buffer.readFloatLE(cursor), next: cursor + 4 };
        break;
      case 0x04:
      case 0x06:
        parsed = { value: buffer.readUInt32LE(cursor), next: cursor + 4 };
        break;
      case 0x05:
        parsed = readWideString(buffer, cursor, end);
        break;
      case 0x07:
        parsed = { value: buffer.readBigUInt64LE(cursor).toString(), next: cursor + 8 };
        break;
      case 0x0a:
        parsed = { value: buffer.readBigInt64LE(cursor).toString(), next: cursor + 8 };
        break;
      default:
        throw new Error(
          `Unsupported Steam binary VDF value type 0x${valueType.toString(16)}`,
        );
    }

    object[key] = parsed.value;
    cursor = parsed.next;
  }

  return { value: object, next: cursor };
}

/**
 * Parses Steam's v41 appinfo cache and returns only public product metadata.
 * The binary entry header also contains access tokens; those bytes are skipped
 * without ever becoming JavaScript values.
 */
export function parseSteamAppInfo(buffer) {
  if (buffer.readUInt32LE(0) !== APPINFO_V41_MAGIC) {
    throw new Error("Unsupported Steam appinfo.vdf version; expected v41");
  }

  const stringTableOffset = Number(buffer.readBigUInt64LE(8));
  const stringTable = readStringTable(buffer, stringTableOffset);
  const apps = new Map();
  let cursor = 16;

  while (cursor < stringTableOffset - 4) {
    const appId = buffer.readUInt32LE(cursor);
    cursor += 4;
    if (appId === 0) break;

    const entrySize = buffer.readUInt32LE(cursor);
    cursor += 4;
    const entryStart = cursor;
    const entryEnd = entryStart + entrySize;
    if (entrySize <= FIXED_APP_HEADER_BYTES || entryEnd > stringTableOffset) {
      cursor = entryEnd;
      continue;
    }

    // info state (4), updated time (4), access token (8), CDN hash (20),
    // change number (4) and binary hash (20) make up the fixed 60-byte header.
    const payloadStart = entryStart + FIXED_APP_HEADER_BYTES;
    try {
      const raw = parseBinaryObject(buffer, payloadStart, entryEnd, stringTable).value;
      const common = raw.appinfo?.common ?? {};
      const localized = common.name_localized ?? {};
      const title = localized.schinese || localized.english || common.name || "";
      apps.set(String(appId), {
        appId: String(appId),
        title: String(title).trim(),
        type: String(common.type ?? "").toLowerCase(),
      });
    } catch {
      // One malformed third-party entry must not make the complete cache unreadable.
    }
    cursor = entryEnd;
  }

  return apps;
}

function tokenizeTextVdf(text) {
  return [...text.matchAll(/"((?:\\.|[^"\\])*)"|([{}])/g)].map((match) => {
    if (match[2]) return match[2];
    return match[1].replaceAll('\\"', '"').replaceAll("\\\\", "\\");
  });
}

/** Parses Steam's text VDF into plain objects without evaluating its contents. */
export function parseSteamTextVdf(text) {
  const tokens = tokenizeTextVdf(text);
  let cursor = 0;

  function readObject(expectClosingBrace = false) {
    const object = {};
    while (cursor < tokens.length) {
      const key = tokens[cursor];
      cursor += 1;
      if (key === "}") {
        if (!expectClosingBrace) throw new Error("Unexpected Steam VDF closing brace");
        return object;
      }
      if (key === "{") continue;

      if (tokens[cursor] === "{") {
        cursor += 1;
        object[key] = readObject(true);
      } else {
        object[key] = tokens[cursor] ?? "";
        cursor += 1;
      }
    }
    if (expectClosingBrace) throw new Error("Unclosed Steam VDF object");
    return object;
  }

  return readObject();
}

/** Returns app IDs with a positive local playtime, but never returns the time itself. */
export function getPlayedSteamAppIds(localConfig) {
  const apps = localConfig.UserLocalConfigStore?.Software?.Valve?.Steam?.apps ?? {};
  return new Set(
    Object.entries(apps)
      .filter(([, value]) => Number(value?.Playtime ?? 0) > 0)
      .map(([appId]) => appId),
  );
}
