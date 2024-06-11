export interface Forwarded {
    name: string;
}

export interface Footer {
    date: {
        unix: number
    };
    views: number;
    author?: string
}

export interface Poll {
    question: string;
    type: string;
    votes: string;
    options: Array<{ name: string; percent: number }>;
}

export interface Media {
    type: string;
    url: string;
    thumb?: string
}

export interface Post {
    id: number;
    forwarded?: Forwarded;
    footer: Footer;
    content?: {
        text?: { html: string; string: string };
        media?: Array<Media>;
        poll?: Poll;
    };
}

export interface Channel {
    avatar?: string;
    title?: string;
    username?: string;
    description?: string;
    counters?: Record<string, number>;
    labels?: Array<string>
}

export interface Props {
    channelId: string;
    postId?: string;
}
