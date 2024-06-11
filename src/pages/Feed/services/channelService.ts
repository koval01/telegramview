import apiService from '../../../apiService';
import {Channel, Post} from '../helpers/types';

export const getChannelData = async (channelId: string, postId?: string) => {
    return await apiService.get<{ channel: Channel; content: { posts: Post[] } }>(
        `body/${channelId}`, {
            params: {position: postId}
        }
    );
};

export const getMorePosts = async (channelId: string, lastPostId: number) => {
    return await apiService.get<{ posts: Post[] }>(
        `more/${channelId}/before/${lastPostId}`
    );
};
