export interface Channel {
    username: string;
    title: string;
    description: string;
    avatar: string;
    subscribers: string;
    is_verified: boolean;
    lastUpdated: number;
}

export interface State {
    state: Channel;
    channels: Channel[];
    channelsLoading: boolean;
    channelsUpdate: boolean;
    channelsError: boolean;
}

export interface FetchChannelByUsername {
    username: string;
    onCallback?: () => void;
    onErrorCallback?: () => void;
}

export interface FetchChannels {
    usernames: string[];
    onCallback?: () => void;
    onErrorCallback?: () => void;
}

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

const callError = () => { throw void 0 };

export { validateResponse, handleError, callError };
