import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Page, Navbar, NavLeft, NavTitle, NavRight, Block, Icon } from 'framework7-react';

dayjs.extend(relativeTime);

interface Post {
    id: number;
    forwarded?: { name: string };
    footer: { date: { unix: number }; views: number };
    content?: {
        text?: { html: string };
        media?: Array<{ type: string; url: string; thumb?: string }>;
    };
}

interface Channel {
    avatar?: string;
    title?: string;
    username?: string;
    description?: string;
    counters?: Record<string, number>;
}

interface Props {
    channelId: string;
    postId?: string;
}

const ChannelPage: React.FC<Props> = ({ channelId, postId }) => {
    const [channel, setChannel] = useState<Channel>({});
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [allowInfinite, setAllowInfinite] = useState(true);

    const loadMore = async () => {
        if (!allowInfinite) return;
        setAllowInfinite(false);

        const lastPostId = posts[posts.length - 1]?.id;

        setTimeout(async () => {
            try {
                const response = await axios.get(
                    `https://tme.koval.page/v1/more/${channelId}/before/${lastPostId}`, {
                        headers: {
                            "X-Front-App-Name": "Telegram View React"
                        }
                    }
                );
                setPosts((prevPosts) => [...prevPosts, ...response.data.posts.reverse()]);
            } catch (error) {
                console.error("Error fetching more posts:", error);
            } finally {
                setAllowInfinite(true);
            }
        }, 1000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://tme.koval.page/v1/body/${channelId}`,
                    {
                        params: {
                            position: postId
                        },
                        headers: {
                            "X-Front-App-Name": "Telegram View React"
                        }
                    }
                );
                setChannel(response.data.channel);
                setPosts(response.data.content.posts.reverse());
            } catch (error) {
                console.error("Error fetching channel data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [channelId]);

    const formatDate = (unixTimestamp: number) => {
        const date = dayjs.unix(unixTimestamp);
        const now = dayjs();
        return now.diff(date, 'hour') < 24 ? date.fromNow() : date.format('MMM D');
    };

    return (
        <Page infinite infiniteDistance={50} infinitePreloader={true} onInfinite={loadMore}>
            <Navbar className="!select-none">
                <NavLeft>
                    {channel.avatar && <img className="w-8 h-8 rounded-full" src={channel.avatar} alt="Avatar" draggable="false" />}
                </NavLeft>
                <NavTitle subtitle={channel.counters?.subscribers ? `${channel.counters.subscribers} subscribers` : ''}>
                    {channel.title || channelId}
                </NavTitle>
                <NavRight>
                    <div></div>
                </NavRight>
            </Navbar>

            <Block className="flex" strong inset>
                <div className="shrink-0">
                    {channel.avatar ? (
                        <img className="w-24 h-24 rounded-full" src={channel.avatar} alt="Avatar" draggable="false" />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-neutral-500"></div>
                    )}
                </div>
                <div className="ml-3 w-full">
                    <div className="text-2xl font-extrabold">{channel.title || channelId}</div>
                    <div className="text-xl text-neutral-400">{channel.username || ''}</div>
                    <div className="text-sm mt-3">{channel.description || ''}</div>
                    {channel.counters && (
                        <div className="flex mt-4">
                            {Object.entries(channel.counters).map(([key, value]) => (
                                <div className="mr-4" key={key}>
                                    <div className="text-lg font-bold">{value}</div>
                                    <div className="text-neutral-500 text-sm">{key}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Block>

            {!loading && (
                <div className="md:mx-16 lg:mx-32 xl:mx-64 2xl:mx-[28vw] mt-8">
                    {posts.map((post, index) => (
                        <div
                            key={index}
                            className={`px-4 ${post.forwarded ? 'py-6' : 'py-3'} bg-transparent first:border-none border-t border-solid border-neutral-700 relative hover:bg-neutral-900 transition-colors duration-200`}
                        >
                            {post.forwarded && (
                                <div className="flex absolute left-[3.25rem] top-1 select-none">
                                    <Icon f7="arrow_turn_left_down" size="16px" className="text-neutral-400 top-1" />
                                    <span className="text-neutral-400 ml-1">{post.forwarded.name}</span>
                                </div>
                            )}
                            <div className="flex">
                                <div className="flex mr-2 shrink-0 relative top-1">
                                    <img className="w-12 h-12 rounded-full" src={channel.avatar} alt="Avatar" draggable="false" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center mb-2 select-none">
                                        <span className="mr-1 font-bold">{channel.title}</span>
                                        <span className="mr-1 text-neutral-400">{channel.username}</span>
                                        <span className="mr-1 text-neutral-400">·</span>
                                        <span className="mr-1 text-neutral-400">{formatDate(post.footer.date.unix)}</span>
                                    </div>
                                    <div className="mb-3">
                                        {post.content?.text?.html && <div dangerouslySetInnerHTML={{ __html: post.content.text.html }} />}
                                        {post.content?.media && post.content.media.length > 0 &&
                                            post.content.media.map((media, mediaIndex) => (
                                                <React.Fragment key={mediaIndex}>
                                                    {media.type === 'image' && (
                                                        <img
                                                            src={media.url}
                                                            alt="Media"
                                                            className={`rounded-xl w-full ${post.content?.text?.html ? 'mt-2' : ''}`}
                                                            draggable="false"
                                                        />
                                                    )}
                                                    {media.type.includes('roundvideo') || media.type.includes('video') && (
                                                        <video
                                                            className={`w-full ${media.type === 'roundvideo' ? 'rounded-full' : 'rounded-xl'} ${post.content?.text?.html ? 'mt-2' : ''}`}
                                                            poster={media.thumb}
                                                            controls
                                                            muted
                                                            preload="auto"
                                                        >
                                                            <source src={media.url} type="video/mp4" />
                                                            <track src={undefined} kind="captions" />
                                                            Your browser does not support the video element.
                                                        </video>
                                                    )}
                                                    {media.type === 'voice' && (
                                                        <audio controls>
                                                            <source src={media.url} type="audio/ogg" />
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                    </div>
                                </div>
                                <div className="text-sm text-neutral-400 select-none">
                                    {post.footer.views && (
                                        <span>
                                            <Icon f7="eye_fill" size="16px" className="!align-baseline mr-1"/>
                                            {post.footer.views}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Page>
    );
};

export default ChannelPage;
