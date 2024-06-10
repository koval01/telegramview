export interface Channel {
    username: string;
    title: string;
    description: string;
    avatar: string;
    subscribers: string;
    is_verified: boolean;
}

export interface UpdateChannel {
    [username: string]: NodeJS.Timeout;
}
