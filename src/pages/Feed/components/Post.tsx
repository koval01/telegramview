import React, { useState } from "react";
import { Channel, Footer, Media, Poll, Post } from "../helpers/types";
import { Icon, Progressbar } from "framework7-react";
import { Verified } from "./Common";
import { formatDate } from "../helpers/date";
import { StringToHtml } from "../helpers/parser";
import { Gallery, Image } from "react-grid-gallery";
import Lightbox, {SlideImage} from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Video from "yet-another-react-lightbox/plugins/video";

export const PostMedia = ({ media }: { media: Media[] }) => {
    const images = media
        .map((m, index) => {
            if (m.type === 'image') {
                return {
                    src: m.url,
                    type: "image",
                    index
                };
            } else if (m.type.includes('video') || m.type.includes('gif')) {
                return {
                    src: m.thumb || m.url,
                    type: "video",
                    width: 1280,
                    height: 720,
                    sources: [{ src: m.url, type: "video/mp4" }],
                    index
                };
            } else {
                return null;
            }
        })
        .filter(m => m !== null) as SlideImage[];

    const [index, setIndex] = useState(-1);
    const handleClick = (index: number) => setIndex(index);

    return (
        <React.Fragment>
            {images.length > 0 && (
                <div className="rounded-xl max-w-full">
                    <Gallery
                        images={images.map(({ src }) => ({ src })) as Image[]}
                        onClick={handleClick}
                        enableImageSelection={false}
                    />
                    <Lightbox
                        plugins={[Fullscreen, Video]}
                        slides={images}
                        open={index >= 0}
                        index={index}
                        close={() => setIndex(-1)}
                    />
                </div>
            )}
            <div className="max-w-72">
                {media
                    .filter(m => m.type === 'voice')
                    .map((m, index) => (
                        <div key={index}>
                            <PostAudio url={m.url} />
                        </div>
                    ))}
            </div>
        </React.Fragment>
    );
};

export const PostRoundVideo = ({ url, thumb }: { url: string, thumb: string | undefined }) => (
    <video
        className="w-full rounded-full"
        poster={thumb}
        controls
        muted
        autoPlay
        preload="auto"
    >
        <source src={url} type="video/mp4" />
        <track src={undefined} kind="captions" />
        Your browser does not support the video element.
    </video>
);

export const PostAudio = ({ url }: { url: string }) => (
    <audio controls>
        <source src={url} type="audio/ogg" />
        Your browser does not support the audio element.
    </audio>
);

export const PollFragment = ({ poll }: { poll: Poll | undefined }) => (
    <React.Fragment>
        {poll && (
            <div className="p-4 pt-2 select-none">
                <div className="mb-1">
                    <div className="font-extrabold">
                        {poll.question}
                    </div>
                    <div className="text-neutral-500">
                        {poll.type}
                    </div>
                </div>
                {poll.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex">
                        <div className="font-bold mr-2 min-w-10">
                            {option.percent}%
                        </div>
                        <div className="w-full">
                            <span className="text-neutral-100">
                                {option.name}
                            </span>
                            <Progressbar progress={option.percent} />
                        </div>
                    </div>
                ))}
            </div>
        )}
    </React.Fragment>
);

export const PostStats = ({ footer, poll }: { footer: Footer, poll?: Poll | undefined }) => (
    <div className="relative flex flex-row justify-end items-end right-0 w-full">
        {footer.views && (
            <div className="flex gap-2">
                {poll && (
                    <div className="flex gap-1">
                        <div>
                            <Icon f7="checkmark_square_fill" size="14px" className="!align-baseline" />
                        </div>
                        <div className="text-sm">
                            {poll.votes}
                        </div>
                    </div>
                )}
                <div className="flex gap-1">
                    <div>
                        <Icon f7="eye_fill" size="14px" className="!align-baseline" />
                    </div>
                    <div className="text-sm">
                        {footer.views}
                    </div>
                </div>
            </div>
        )}
    </div>
);

export const PostAuthor = ({ footer }: { footer: Footer }) => (
    <div className="relative flex flex-row justify-start items-end">
        {footer.author && (
            <div className="flex gap-1">
                <div>
                    <Icon f7="person" size="14px" className="!align-baseline" />
                </div>
                <div className="text-sm w-full whitespace-nowrap">
                    {footer.author}
                </div>
            </div>
        )}
    </div>
);

export const PostHead = ({ channel, post }: { channel: Channel, post: Post }) => (
    <React.Fragment>
        <div>
            <div
                className="rounded-full w-12 h-12 bg-cover"
                style={{ backgroundImage: `url(${channel.avatar})` }}>
            </div>
        </div>
        <div>
            <div className="font-bold text-white flex gap-1">
                <div className="whitespace-nowrap">
                    {channel.title}
                </div>
                <div>
                    <Verified verified={!!channel.labels && channel.labels.includes("verified")} />
                </div>
            </div>
            <div className="font-light text-xs text-neutral-400">
                <time>{formatDate(post.footer.date.unix)}</time>
            </div>
        </div>
    </React.Fragment>
);

export const PostFragment: React.FC<{ channel: Channel; post: Post }> = ({ channel, post }) => (
    <div className="p-4 mt-5 bg-neutral-900 relative md:rounded-xl">
        <div>
            <div className="flex gap-2 select-none">
                <PostHead channel={channel} post={post} />
            </div>
            <div className="mt-2">
                {post.content?.text?.string && <StringToHtml text={post.content.text.string} />}
                {post.content?.media && post.content.media.length > 0 && (
                    post.content.media.some(m => m.type === 'roundvideo') ? (
                        post.content.media.filter(m => m.type === 'roundvideo').map((m, index) => (
                            <PostRoundVideo key={index} url={m.url} thumb={m.thumb} />
                        ))
                    ) : (
                        <PostMedia media={post.content.media} />
                    )
                )}
                <PollFragment poll={post.content?.poll} />
            </div>
            <div className="flex mt-3 h-4 w-full select-none text-neutral-400">
                <PostAuthor footer={post.footer} />
                <PostStats footer={post.footer} poll={post.content?.poll} />
            </div>
        </div>
    </div>
);
