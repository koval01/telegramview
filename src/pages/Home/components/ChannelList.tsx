import React from 'react';
import { List, ListItem, Preloader } from 'framework7-react';
import VerifiedIcon from '../../../icons/VerifiedIcon.tsx';
import store from "../../../store.ts";

interface Channel {
    username: string;
    title: string;
    description: string;
    avatar: string;
    subscribers: string;
    is_verified: boolean;
}

interface ChannelListProps {
    filteredChannels: Channel[];
    loading: boolean;
    handleAvatarError: (username: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({ filteredChannels, loading, handleAvatarError }) => {
    return (
        <>
            {loading || store.state.channelsLoading ? (
                <div className="mt-4">
                    <Preloader size={48} className="block m-auto" />
                </div>
            ) : filteredChannels.length === 0 ? (
                <List strongIos outlineIos dividersIos className="searchbar-not-found">
                    <ListItem title="Nothing found" />
                </List>
            ) : (
                <List strongIos outlineIos dividersIos mediaList className="search-list searchbar-found">
                    {filteredChannels.map((channel) => {
                        const title = (
                            <div className="flex gap-0.5">
                                <div>{channel.title}</div>
                                {channel.is_verified && (
                                    <div>
                                        <VerifiedIcon className="w-6 h-6"/>
                                    </div>
                                )}
                            </div>
                        );
                        return (
                            <ListItem
                                link={`/${channel.username}`}
                                key={channel.username}
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                title={title}
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
                        )
                    })}
                </List>
            )}
        </>
    );
};

export default ChannelList;
