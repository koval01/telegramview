import store from '../../../../store';
import { Channel } from '../types.ts';

export function loadChannelsFromStorage() {
    const storedChannels = localStorage.getItem('channels');
    if (!storedChannels) return;

    store.state.channels = JSON.parse(storedChannels) as Channel[];
}

export function saveChannelsToStorage(channels: Channel[]) {
    if (!channels.length) return;
    if (channels.length > 10) {
        store.state.channels = channels.slice(0, 10);
    }
    localStorage.setItem('channels', JSON.stringify(channels));
}
