import { createStore } from 'framework7/lite';
import apiService from './apiService';

interface Channel {
    username: string;
    title: string;
    description: string;
    avatar: string;
    subscribers: string;
    is_verified: boolean;
    lastUpdated: number;
}

interface State {
    state: Channel;
    channels: Channel[];
    channelsLoading: boolean;
}

const store = createStore({
    state: {
        channels: [],
        channelsLoading: false,
    },
    actions: {
        async fetchChannelByUsername({ state }: { state: State }, username: string) {
            state.channelsLoading = true;
            try {
                const response = await apiService.get<{ channel: Channel }>(`preview/${username}`);
                if (response && response.channel) {
                    const newChannel = { ...response.channel, username, lastUpdated: Date.now() };
                    state.channels = state.channels.filter(channel => channel.username !== newChannel.username);
                    state.channels.unshift(newChannel);
                }
            } catch (error) {
                console.error('Error fetching channel by username:', error);
            } finally {
                state.channelsLoading = false;
            }
        },
    },
    getters: {
        channels: ({ state }: { state: State }) => state.channels,
        channelsLoading: ({ state }: { state: State }) => state.channelsLoading,
    },
});

export default store;
