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
    channelsError: boolean;
}

interface FetchChannelByUsername {
    username: string;
    onCallback?: () => void;
    onErrorCallback?: () => void;
}

const store = createStore({
    state: {
        channels: [],
        channelsLoading: false,
        channelsError: false,
    },
    actions: {
        async fetchChannelByUsername({ state }: { state: State }, data: FetchChannelByUsername) {
            state.channelsLoading = true;
            state.channelsError = false;

            const username = data.username;
            const onErrorCallback = data.onErrorCallback;
            const onCallback = data.onCallback;

            const validateResponse = (response: { channel: Channel; } | undefined) => {
                if (!response) throw void 0;
                if (!response.channel) throw void 0;

                const newChannel = { ...response.channel, username, lastUpdated: Date.now() };
                state.channels = state.channels.filter(channel => channel.username !== newChannel.username);
                state.channels.unshift(newChannel);
            }

            try {
                const response = await apiService.get<{ channel: Channel }>(`preview/${username}`);
                validateResponse(response);
            } catch (error) {
                state.channelsError = true;
                if (onErrorCallback) onErrorCallback();
                console.error('Error fetching channel by username:', error);
            } finally {
                if (onCallback && !state.channelsError) onCallback();
                state.channelsLoading = false;
                state.channelsError = false;
            }
        },
    },
    getters: {
        channels: ({ state }: { state: State }) => state.channels,
        channelsLoading: ({ state }: { state: State }) => state.channelsLoading,
    },
});

export default store;
