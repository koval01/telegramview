import {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
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
    };

    const filterChannels = (query: string, update: boolean) => {
        const filtered = channels.filter((channel) =>
            channel.username.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length && !update) {
            return filtered;
        }

        return;
    }

    const searchAction = useCallback(async (query: string = "", update: boolean = false) => {
        setLoading(true);

        const finish = (data: Channel[]) => {
            setFilteredChannels(data);
            setLoading(false);
        };

        if (query !== '') {
            const filtered = filterChannels(query, update);
            if (filtered) {
                finish(filtered);
                return;
            }

            await callFetch(query);
        }

        finish(channels);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value?.toLowerCase();
        setSearchQuery(query);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            searchAction(query).then();
        }, 600);
    };

    const loadChannelsFromStorage = () => {
        const storedChannels = localStorage.getItem('channels');
        if (!storedChannels) return;

        // pre-init channels store
        store.state.channels = JSON.parse(storedChannels) as Channel[];
    }

    const saveChannelsToStorage = () => {
        if (!channels.length) return;
        if (channels.length > 10) {
            store.state.channels = channels.slice(0, 10);
        }
        localStorage.setItem('channels', JSON.stringify(channels));
    }

    useEffect(() => {
        searchAction(searchQuery).then();
        saveChannelsToStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels]);

    useEffect(() => loadChannelsFromStorage(), []);

    const handleAvatarError = async (username: string) => {
        await searchAction(username, true);
    };

    return { searchQuery, filteredChannels, loading, handleSearchChange, handleAvatarError, searchAction };
}
