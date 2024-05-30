import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { Page, Navbar, Subnavbar, Searchbar, List, ListItem, Preloader } from 'framework7-react';
import store from '../store';

interface Channel {
    username: string;
    title: string;
    description: string;
    avatar: string;
    subscribers: string;
    is_verified: boolean;
}

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const channels = store.state.channels as Channel[];
    const usersLoading = store.state.channelsLoading as boolean;

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
        }, 500);
    };

    useEffect(() => {
        searchAction(searchQuery).then();
    }, [channels]);

    const handleAvatarError = async (username: string) => {
        await searchAction(username);
        setFilteredChannels(store.getters.channels.value);
    };

    return (
        <Page>
            <Navbar title="Telegram View">
                <Subnavbar inner={false}>
                    <Searchbar
                        onChange={handleSearchChange}
                        onClickClear={() => { searchAction().then() }}
                        onClickDisable={() => { searchAction().then() }}
                        customSearch
                    />
                </Subnavbar>
            </Navbar>
            {loading || usersLoading ? (
                <div className="mt-4">
                    <Preloader size={48} className="block m-auto" />
                </div>
            ) : filteredChannels.length === 0 ? (
                <List strongIos outlineIos dividersIos className="searchbar-not-found">
                    <ListItem title="Nothing found" />
                </List>
            ) : (
                <List strongIos outlineIos dividersIos mediaList className="search-list searchbar-found">
                    {filteredChannels.map((channel) => (
                        <ListItem
                            link={`/${channel.username}`}
                            key={channel.username}
                            title={channel.title}
                            after={`@${channel.username}`}
                            subtitle={channel.subscribers}
                            text={channel.description}
                        >
                            <img
                                src={channel.avatar}
                                alt={`${channel.title}'s avatar`}
                                className="icon w-12 h-12 rounded-full"
                                slot="media"
                                draggable="false"
                                onError={() => handleAvatarError(channel.username)}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Page>
    );
}
