import { useState, useEffect } from 'react';
import { Page, Navbar, Subnavbar, Searchbar, List, ListItem, Preloader } from 'framework7-react';
import apiService from '../apiService';

interface Channel {
    username: string;
    title: string;
    description: string;
    avatar: string;
    subscribers: string;
    is_verified: boolean;
}

interface ApiResponse {
    channel: Channel;
}

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [channels, setChannels] = useState<Channel[]>([]);
    const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);

    // Load channels from localStorage
    useEffect(() => {
        const storedChannels = localStorage.getItem('channels');
        if (storedChannels) {
            const parsedChannels = JSON.parse(storedChannels) as Channel[];
            setChannels(parsedChannels);
            setFilteredChannels(parsedChannels);
        } else {
            fetchChannels().then();
        }
    }, []);

    // Save channels to localStorage
    useEffect(() => {
        localStorage.setItem('channels', JSON.stringify(channels));
    }, [channels]);

    // Fetch the initial list of channels
    const fetchChannels = async () => {
        const channelIds = ['durov'];
        const fetchedChannels: Channel[] = [];

        for (const channelId of channelIds) {
            const response = await apiService.get<ApiResponse>(`preview/${channelId}`);
            if (response) {
                response.channel.username = channelId;
                fetchedChannels.push(response.channel);
            }
        }

        setChannels(fetchedChannels);
        setFilteredChannels(fetchedChannels);
    };

    useEffect(() => {
        // Filter channels based on search query
        const fetchChannelByUsername = async (username: string) => {
            setLoading(true);
            try {
                const response = await apiService.get<ApiResponse>(`preview/${username}`);
                if (response) {
                    response.channel.username = username;
                    const newChannel = response.channel;

                    setChannels(prevChannels => {
                        const updatedChannels = prevChannels.filter(channel => channel.username !== newChannel.username);
                        updatedChannels.unshift(newChannel);
                        return updatedChannels;
                    });

                    setFilteredChannels(prevChannels => {
                        const updatedChannels = prevChannels.filter(channel => channel.username !== newChannel.username);
                        updatedChannels.unshift(newChannel);
                        return updatedChannels;
                    });
                }
            } catch (error) {
                // Handle error, e.g., show notification or message
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery === '') {
            setFilteredChannels(channels);
        } else {
            const filtered = channels.filter(channel =>
                channel.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (filtered.length > 0) {
                setFilteredChannels(filtered);
                // Move the found channel to the top
                setChannels(prevChannels => {
                    const updatedChannels = prevChannels.filter(channel => channel.username.toLowerCase() !== filtered[0].username.toLowerCase());
                    updatedChannels.unshift(filtered[0]);
                    return updatedChannels;
                });
            } else {
                fetchChannelByUsername(searchQuery).then();
            }
        }
    }, [searchQuery, channels]);

    return (
        <Page>
            <Navbar title="Telegram View">
                <Subnavbar inner={false}>
                    <Searchbar
                        onChange={(e) => setSearchQuery(e.target.value)}
                        customSearch
                    />
                </Subnavbar>
            </Navbar>
            {loading ? (
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
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Page>
    );
}
