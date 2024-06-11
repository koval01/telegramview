import React, { useEffect, useState } from 'react';
import {Page, Block, Navbar, NavTitle, NavRight} from 'framework7-react';

import { Props } from "./helpers/types";
import { useChannelData } from "./hooks/useChannelData";
import ProfilePopup from './components/ProfilePopup';
import PostList from './components/PostList';
import {Profile} from "./components/Profile";
import {ChannelTitle} from "./components/Channel";

const ChannelPage: React.FC<Props> = ({ channelId, postId }) => {
    const { channel, posts, loading, fetchData, loadMore, showPreloader } = useChannelData(channelId, postId);
    const [popupOpened, setPopupOpened] = useState(false);

    useEffect(() => {
        fetchData().then();
    }, [fetchData]);

    const refreshData = async (done: () => void) => {
        await fetchData();
        done();
    };

    return (
        <Page
            infinite
            infiniteDistance={32}
            infinitePreloader={showPreloader}
            onInfinite={loadMore}
            ptr
            ptrMousewheel={true}
            onPtrRefresh={refreshData}
        >
            <Navbar className="!select-none" backLink="Back">
                <div className="contents" onClick={() => setPopupOpened(true)}>
                    <NavTitle
                        subtitle={channel.counters?.subscribers ? `${channel.counters.subscribers} subscribers` : ''}>
                        <div className="flex gap-0.5">
                            <ChannelTitle title={channel.title || ""} labels={channel.labels} badgeSize={18} />
                        </div>
                    </NavTitle>
                    <NavRight>
                        {channel.avatar &&
                            <img
                                className="w-8 h-8 rounded-full"
                                src={channel.avatar}
                                alt="Avatar"
                                draggable="false" />
                        }
                    </NavRight>
                </div>
            </Navbar>
            <ProfilePopup channel={channel} popupOpened={popupOpened} setPopupOpened={setPopupOpened} />
            <Block className="hidden lg:flex">
                <Profile channel={channel} />
            </Block>
            {!loading && <PostList posts={posts} channel={channel} />}
        </Page>
    );
};

export default ChannelPage;
