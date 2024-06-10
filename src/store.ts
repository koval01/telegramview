import { createStore } from 'framework7/lite';
import apiService from './apiService';

import {
    FetchChannelByUsername,
    FetchChannels,
    State,
    Channel,
    validateResponse,
    handleError,
    callError
} from './helpers';

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
                if (!response) {
                    callError();
                    return;
                }

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
                if (!response) callError();

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

export default store;
