import React, {useCallback, useEffect, useRef, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import {Toast} from "framework7/types";
import {Block, f7, Icon, Link, Navbar, NavRight, NavTitle, Page, Progressbar} from 'framework7-react';
import apiService from '../../apiService.ts';
import VerifiedIcon from '../../icons/VerifiedIcon.tsx';
import './feed.css';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
    relativeTime: {
        past: "%s",
        s: '1s',
        ss: '%ds',
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
    }
});

interface Post {
    id: number;
    forwarded?: { name: string };
    footer: { date: { unix: number }; views: number; author?: string };
    content?: {
        text?: { html: string; string: string };
        media?: Array<{ type: string; url: string; thumb?: string }>;
        poll?: {
            question: string;
            type: string;
            votes: string;
            options: Array<{ name: string; percent: number }>;
        };
    };
}

interface Channel {
    avatar?: string;
    title?: string;
    username?: string;
    description?: string;
    counters?: Record<string, number>;
    labels?: Array<string>
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
    const [showPreloader, setShowPreloader] = useState(false);

    const toastCenter = useRef<Toast.Toast | null>(null);

    const showToastCenter = (message: string) => {
        if (!toastCenter.current) {
            toastCenter.current = f7.toast.create({
                text: message,
                position: 'center',
                closeTimeout: 2000,
            });
        }
        toastCenter.current.open();
    };

    const loadMore = async () => {
        if (!allowInfinite) return;

        const lastPostId = posts[posts.length - 1]?.id;
        if (lastPostId <= 1) return;

        setShowPreloader(true);
        setAllowInfinite(false);

        setTimeout(async () => {
            try {
                const response = await apiService.get<{ posts: Post[] }>(`more/${channelId}/before/${lastPostId}`);
                if (response) {
                    setPosts((prevPosts) => [...prevPosts, ...response.posts.reverse()]);
                }
            } catch (error) {
                console.error("Error fetching more posts:", error);
                showToastCenter("Error fetching more posts");
            } finally {
                setAllowInfinite(true);
                setShowPreloader(false);
            }
        }, 1000);
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await apiService.get<{ channel: Channel; content: { posts: Post[] } }>(`body/${channelId}`, {
                params: {
                    position: postId
                }
            });
            if (response) {
                setChannel(response.channel);
                setPosts(response.content.posts.reverse());
            }
        } catch (error) {
            console.error("Error fetching channel data:", error);
            showToastCenter("Error fetching channel data");
        } finally {
            setLoading(false);
        }
    }, [channelId, postId]);

    const refreshData = async (done: () => void) => {
        await fetchData();
        done();
    };

    useEffect(() => {
        fetchData().then();
    }, [fetchData]);

    const onPageBeforeOut = () => {
        // @ts-expect-error: In the documentation, this method is used without arguments
        f7.toast.close();
    };
    const onPageBeforeRemove = () => {
        if (toastCenter.current) toastCenter.current.destroy();
    };

    const formatDate = (unixTimestamp: number) => {
        const date = dayjs.unix(unixTimestamp);
        const now = dayjs();
        return now.diff(date, 'hour') < 24 ? date.fromNow() : date.format('MMM D');
    };

    const convertLinksToJSX = (text: string): React.ReactNode[] => {
        const urlRegex = /(\bhttps?:\/\/\S+\b|\b\S+\.\S+\b)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part?.match(urlRegex)) {
                let href = part;
                if (!href.match(/^https?:\/\//)) {
                    href = 'https://' + href;
                }
                return (
                    <Link key={index} href={href} target="_blank" external
                          className="truncate min-w-0 max-w-40 md:max-w-64 lg:max-w-96 inline-block align-bottom text-blue-500">
                        {part}</Link>
                );
            }

            return part;
        });
    };

    const StringToHtml = ({ text }: { text: string }) => {
        const lines = text.split('\n');

        const elements = lines.map((line, index) => (
            <React.Fragment key={index}>
                {convertLinksToJSX(line)}
                {index < lines.length - 1 && <br />}
            </React.Fragment>
        ));

        return <div>{elements}</div>;
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
            onPageBeforeRemove={onPageBeforeRemove}
            onPageBeforeOut={onPageBeforeOut}
        >
            <Navbar className="!select-none" backLink="Back">
                <NavTitle subtitle={channel.counters?.subscribers ? `${channel.counters.subscribers} subscribers` : ''}>
                    <div className="flex gap-0.5">
                        <div>{channel.title || channelId}</div>
                        {channel.labels?.includes("verified") && (
                            <div>
                                <VerifiedIcon className="w-5 h-5"/>
                            </div>
                        )}
                    </div>
                </NavTitle>
                <NavRight>
                    {channel.avatar &&
                        <img className="w-8 h-8 rounded-full" src={channel.avatar} alt="Avatar" draggable="false"/>
                    }
                </NavRight>
            </Navbar>

            <Block className="hidden select-none md:flex lg:px-64">
                <div className="m-auto flex">
                    <div className="shrink-0">
                        {channel.avatar ? (
                            <img className="w-24 h-24 rounded-full" src={channel.avatar} alt="Avatar"
                                 draggable="false"/>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-neutral-500"></div>
                        )}
                    </div>
                    <div className="ml-3 w-full">
                        <div className="text-2xl font-extrabold flex gap-1">
                            <div>
                                {channel.title || channelId}
                            </div>
                            {channel.labels?.includes("verified") && (
                                <div>
                                    <VerifiedIcon
                                        className="w-8 h-8 active:text-sky-300 active:scale-150 transition-all"/>
                                </div>
                            )}
                        </div>
                        <div className="text-lg text-neutral-400">{channel.username || ''}</div>
                        <div className="text-sm mt-3">{channel.description || ''}</div>
                        {channel.counters && (
                            <div className="flex mt-4">
                                {Object.entries(channel.counters).map(([key, value]) => (
                                    <div className="mr-4" key={key}>
                                        <div className="text-lg font-bold">{value}</div>
                                        <div className="text-neutral-300 text-sm">{key}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Block>

            {!loading && (
                <div className="w-full md:max-w-[680px] lg:max-w-[860px] xl:max-w-[920px] 2xl:max-w-[1060px] p-0 mt-8 block m-auto">
                    {posts.map((post, index) => (
                        <div
                            key={index}
                            className={`px-4 ${post.forwarded ? 'py-6' : 'py-3'} bg-transparent first:border-none border-t border-solid border-neutral-700 relative active:bg-neutral-900 transition-colors duration-200`}
                        >
                            {post.forwarded && (
                                <div className="flex absolute left-[3.25rem] top-1 select-none max-w-full">
                                    <Icon f7="arrow_turn_left_down" size="16px" className="text-neutral-400 top-1"/>
                                    <span
                                        className="text-neutral-400 ml-1 inline-block truncate">{post.forwarded.name}</span>
                                </div>
                            )}
                            <div className="flex">
                                <div className="flex mr-2 shrink-0 relative top-1 select-none">
                                    <img className="w-12 h-12 rounded-full" src={channel.avatar} alt="Avatar"
                                         draggable="false"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center mb-2 select-none w-full">
                                        <div className="flex-row max-w-full shrink items-center t-container">
                                            <div className="max-w-full shrink t-container">
                                                <Link href={`/${channel.username?.slice(1)}`} className="max-w-full shrink outline-none cursor-pointer t-container">
                                                    <div className="flex-row max-w-full shrink items-center t-container">
                                                        <div className="leading-5 min-w-0 font-bold text-base whitespace-nowrap flex overflow-x-hidden overflow-y-hidden t-container">
                                                            <span className="max-w-full min-w-0 whitespace-nowrap overflow-x-hidden overflow-y-hidden t-container">
                                                                <span className="min-w-0 whitespace-nowrap t-container">
                                                                    {channel.title}
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <div className="leading-5 shrink-0 min-w-0 text-base font-normal flex-row inline-flex t-container">
                                                            <span className="min-w-0 items-center inline-flex t-container">
                                                                <VerifiedIcon className="w-5 h-5 relative ml-0.5 inline-block t-container"/>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex-row max-w-full shrink items-center t-container ml-1">
                                            <div className="items-baseline shrink flex-row t-container">
                                                <div className="max-w-full shrink t-container">
                                                    <Link className="max-w-full shrink cursor-pointer outline-none" href={`/${channel.username?.slice(1)}`}>
                                                        <div className="text-neutral-400 max-w-full min-w-0 whitespace-nowrap overflow-x-hidden overflow-y-hidden t-container text-sm text-clip font-normal">
                                                            <span className="text-clip t-container min-w-0">
                                                                {channel.username}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="text-neutral-400 text-sm shrink leading-5 px-1 min-w-0 t-container">
                                                    <span className="min-w-0 t-container">
                                                        ·
                                                    </span>
                                                </div>
                                                <div className="shrink-0 flex-row t-container">
                                                    <Link className="text-neutral-400 text-sm font-normal gap-1 flex-wrap shrink-0 leading-5 min-w-0 cursor-pointer inline-flex" href={`/${channel.username?.slice(1)}`}>
                                                        <time>{formatDate(post.footer.date.unix)}</time>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        {post.content?.text?.string && <StringToHtml text={post.content.text.string} />}
                                        {post.content?.media && post.content.media.length > 0 &&
                                            post.content.media.map((media, mediaIndex) => (
                                                <React.Fragment key={mediaIndex}>
                                                    {media.type === 'image' && (
                                                        <img
                                                            src={media.url}
                                                            alt="Media"
                                                            className={`rounded-xl w-full ${post.content?.text?.string ? 'mt-2' : ''}`}
                                                            draggable="false"
                                                        />
                                                    )}
                                                    {(media.type.includes('roundvideo') || media.type.includes('video') || media.type.includes('gif') || (media.type.includes('sticker') && media.url.includes(".webm") && media.thumb)) && (
                                                        <video
                                                            className={`w-full ${media.type === 'roundvideo' ? 'rounded-full' : 'rounded-xl'} ${post.content?.text?.html ? 'mt-2' : ''}`}
                                                            poster={media.thumb}
                                                            controls
                                                            muted
                                                            preload="auto"
                                                        >
                                                            <source src={media.url} type="video/mp4"/>
                                                            <track src={undefined} kind="captions"/>
                                                            Your browser does not support the video element.
                                                        </video>
                                                    )}
                                                    {media.type === 'voice' && (
                                                        <audio controls>
                                                            <source src={media.url} type="audio/ogg"/>
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        {post.content?.poll && (
                                            <div className="p-4 pt-2 select-none">
                                                <div className="mb-1">
                                                    <div className="font-extrabold">{post.content.poll.question}</div>
                                                    <div className="text-neutral-500">{post.content.poll.type}</div>
                                                </div>
                                                {post.content.poll.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex">
                                                        <div className="font-bold mr-2 min-w-10">{option.percent}%</div>
                                                        <div className="w-full">
                                                            <span className="text-neutral-100">{option.name}</span>
                                                            <Progressbar progress={option.percent}/>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {post.footer?.author && (
                                            <div className="mt-2 flex gap-1 text-neutral-400 select-none">
                                                <div>
                                                    <Icon f7="person" size="12px"/>
                                                </div>
                                                <div>{post.footer.author}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="select-none">
                                    {post.footer.views && (
                                        <div className="flex gap-1 text-neutral-400">
                                            <div>
                                                <Icon f7="eye_fill" size="14px"/>
                                            </div>
                                            <div className="text-sm">
                                                {post.footer.views}
                                            </div>
                                        </div>
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
