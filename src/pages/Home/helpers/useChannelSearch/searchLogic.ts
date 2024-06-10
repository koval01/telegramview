import React, { useState, useRef, useCallback } from 'react';
import store from '../../../../store';
import { Channel } from '../types';
import { useToast } from '../useToast/hook';

export function useSearchLogic() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const channels = store.state.channels as Channel[];
    const { showToastCenter } = useToast();

    const callFetch = async (query: string, onCallback?: () => void) => {
        await store.dispatch('fetchChannelByUsername', {
            username: query,
            onCallback: onCallback,
            onErrorCallback: () => showToastCenter(`Failed to fetch ${query}'s channel information`)
        });
    };

    const filterChannels = (query: string, update: boolean) => {
        const filtered = channels.filter((channel) =>
            channel.username.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length && !update) {
            return filtered;
        }

        return;
    };

    const searchAction = useCallback(async (
        query: string = "",
        update: boolean = false,
        onCallback?: () => void
    ) => {
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

            await callFetch(query, onCallback);
        }

        finish(channels);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value?.toLowerCase();
        setSearchQuery(query);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            searchAction(query).then();
        }, 800);
    };

    return { searchQuery, filteredChannels, loading, handleSearchChange, searchAction };
}
