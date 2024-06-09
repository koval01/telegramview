import React from 'react';
import { List, ListItem } from 'framework7-react';
import { Loader, Empty, Title, Avatar, AvatarSkeleton } from './Common';
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

const ChannelList: React.FC<ChannelListProps> = ({filteredChannels, loading, handleAvatarError}) =>
(
    <>
        {loading || store.state.channelsLoading && !store.state.channelsUpdate ? (
            <Loader/>
        ) : filteredChannels.length === 0 ? (
            <Empty/>
        ) : (
            <List strongIos outlineIos dividersIos mediaList className="search-list searchbar-found">
                {filteredChannels.map((channel) => {
                    return (
                        <ListItem
                            link={`/${channel.username}`}
                            key={channel.username}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            title={<Title title={channel.title} isVerified={channel.is_verified} />}
                            after={`@${channel.username}`}
                            subtitle={channel.subscribers}
                            text={channel.description}
                        >
                            <div slot="media">
                                {channel.avatar ? (
                                    <Avatar
                                        avatar={channel.avatar}
                                        title={channel.title}
                                        username={channel.username}
                                        onError={handleAvatarError}
                                    />
                                ) : (
                                    <AvatarSkeleton />
                                )}
                            </div>
                        </ListItem>
                    )
                })}
            </List>
        )}
    </>
);

export default ChannelList;
