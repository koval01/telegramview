import { useCallback, useState } from 'react';
import { Channel, Post } from '../helpers/types';
import { getChannelData, getMorePosts } from '../services/channelService';

export const useChannelData = (channelId: string, postId?: string) => {
    const [channel, setChannel] = useState<Channel>({});
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [allowInfinite, setAllowInfinite] = useState(true);
    const [showPreloader, setShowPreloader] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const response = await getChannelData(channelId, postId);
            if (response) {
                setChannel(response.channel);
                setPosts(response.content.posts.reverse());
            }
        } catch (error) {
            console.error("Error fetching channel data:", error);
        } finally {
            setLoading(false);
        }
    }, [channelId, postId]);

    const loadMore = async () => {
        if (!allowInfinite) return;

        const lastPostId = posts[posts.length - 1]?.id;
        if (lastPostId <= 1) return;

        setShowPreloader(true);
        setAllowInfinite(false);

        setTimeout(async () => {
            try {
                const response = await getMorePosts(channelId, lastPostId);
                if (response) {
                    setPosts((prevPosts) => [...prevPosts, ...response.posts.reverse()]);
                }
            } catch (error) {
                console.error("Error fetching more posts:", error);
            } finally {
                setAllowInfinite(true);
                setShowPreloader(false);
            }
        }, 1000);
    };

    return { channel, posts, loading, fetchData, loadMore, showPreloader, setAllowInfinite };
};
