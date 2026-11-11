import { favoriteChannels } from "@/content/site";

export type ChannelId = (typeof favoriteChannels)[number]["id"];

const CHANNEL_STORAGE_KEY = "sekai-channel";
const CHANNEL_CHANGE_EVENT = "sekai-channel-change";

function isChannelId(value: string | null | undefined): value is ChannelId {
  return favoriteChannels.some((channel) => channel.id === value);
}

/** Read only during client snapshots; server rendering always starts with Miku. */
export function clientChannelSnapshot(): ChannelId {
  const channel = document.documentElement.dataset.channel;
  return isChannelId(channel) ? channel : "miku";
}

export function serverChannelSnapshot(): ChannelId {
  return "miku";
}

export function subscribeToChannel(onStoreChange: () => void) {
  window.addEventListener(CHANNEL_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(CHANNEL_CHANGE_EVENT, onStoreChange);
}

/** Both character galleries share the same device-local theme and change event. */
export function setClientChannel(channel: ChannelId) {
  document.documentElement.dataset.channel = channel;
  try {
    window.localStorage.setItem(CHANNEL_STORAGE_KEY, channel);
  } catch {
    // The active visual channel still works for this page without storage.
  }
  window.dispatchEvent(new Event(CHANNEL_CHANGE_EVENT));
}
