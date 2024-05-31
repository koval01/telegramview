import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import store from '../../../store';

interface Channel {
    username: string;
    title: string;
    description: string;
    avatar: string;
    subscribers: string;
    is_verified: boolean;
}

export default function useChannelSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const channels = store.state.channels as Channel[];

    const callFetch = async (query: string) => {
        await store.dispatch('fetchChannelByUsername', query);
        setFilteredChannels(store.getters.channels.value);
    };

    const searchAction = useCallback(async (query: string = "") => {
        setLoading(true);

        if (query === '') {
            setFilteredChannels(channels);
        } else {
            const filtered = channels.filter((channel) =>
                channel.username.toLowerCase().includes(query.toLowerCase())
            );

            if (filtered.length) {
                setFilteredChannels(filtered);
            } else {
                await callFetch(query);
            }
        }

        setLoading(false);
    }, [channels]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            searchAction(query).then();
        }, 600);
    };

    useEffect(() => {
        searchAction(searchQuery).then();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels]);

    const handleAvatarError = async (username: string) => {
        await searchAction(username);
        setFilteredChannels(store.getters.channels.value);
    };

    return { searchQuery, filteredChannels, loading, handleSearchChange, handleAvatarError, searchAction };
}
