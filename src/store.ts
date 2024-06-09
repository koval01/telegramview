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
    channelsUpdate: boolean;
    channelsError: boolean;
}

interface FetchChannelByUsername {
    username: string;
    onCallback?: () => void;
    onErrorCallback?: () => void;
}

interface FetchChannels {
    usernames: string[];
    onCallback?: () => void;
    onErrorCallback?: () => void;
}

const store = createStore({
    state: {
        channels: [],
        channelsLoading: false,
        channelsUpdate: false,
        channelsError: false,
    },
    actions: {
        async fetchChannelByUsername({ state }: { state: State }, data: FetchChannelByUsername) {
            state.channelsLoading = true;
            state.channelsError = false;

            try {
                const response = await apiService.get<{ channel: Channel }>(
                    `preview/${data.username}`);
                if (!response)
                    return;
                validateResponse(state, { ...response.channel, username: data.username });
                if (data.onCallback) data.onCallback();
            } catch (error) {
                handleError(state, data.onErrorCallback, error);
            } finally {
                state.channelsLoading = false;
            }
        },

        async fetchChannels({ state }: { state: State }, data: FetchChannels) {
            state.channelsLoading = state.channelsUpdate = true;
            state.channelsError = false;

            try {
                const response =
                    await apiService.post<Record<string, { channel: Channel }>>(
                        'previews', data.usernames);
                for (const username in response) {
                    if (Object.prototype.hasOwnProperty.call(response, username)) {
                        validateResponse(state, { ...response[username].channel, username });
                    }
                }
                if (data.onCallback) data.onCallback();
            } catch (error) {
                handleError(state, data.onErrorCallback, error);
            } finally {
                state.channelsLoading = state.channelsUpdate = false;
            }
        },
    },
    getters: {
        channels: ({ state }: { state: State }) => state.channels,
        channelsLoading: ({ state }: { state: State }) => state.channelsLoading,
    },
});

const validateResponse = (state: State, newChannel: Channel) => {
    newChannel.lastUpdated = Date.now();
    state.channels = state.channels.filter(channel => channel.username !== newChannel.username);
    state.channels.unshift(newChannel);
}

const handleError = (state: State, onErrorCallback: (() => void) | undefined, error: unknown) => {
    state.channelsError = true;
    if (onErrorCallback) onErrorCallback();
    console.error('Error fetching channels:', error);
}

export default store;
