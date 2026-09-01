function byAppId(items) {
  return new Map(items.map((item) => [String(item.appId), item]));
}

/** Compare only public catalog fields; private Steam activity never enters here. */
export function compareSteamCatalogs(previousItems, nextItems) {
  const previous = byAppId(previousItems);
  const next = byAppId(nextItems);
  return {
    added: nextItems.filter((item) => !previous.has(String(item.appId))),
    removed: previousItems.filter((item) => !next.has(String(item.appId))),
    coversAdded: nextItems.filter((item) => {
      const old = previous.get(String(item.appId));
      return item.image && !old?.image;
    }),
    coversLost: previousItems.filter((item) => {
      const incoming = next.get(String(item.appId));
      return incoming && item.image && !incoming.image;
    }),
  };
}

export function assertSafeSteamCatalogChange(
  comparison,
  { allowRemovals = false } = {},
) {
  if (comparison.removed.length > 0 && !allowRemovals) {
    throw new Error(
      `The local Steam cache is missing ${comparison.removed.length} existing catalog item(s). ` +
        "The public catalog was left unchanged. Verify the selected Steam user and cache, " +
        "or explicitly pass --allow-removals after reviewing the diff.",
    );
  }
  if (comparison.coversLost.length > 0) {
    throw new Error(
      `Generated snapshot would lose ${comparison.coversLost.length} existing cover(s); ` +
        "the public catalog was left unchanged.",
    );
  }
}
