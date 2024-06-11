import {Channel, Footer, Media, Poll, Post} from "../helpers/types";
import React from "react";
import {Icon, Progressbar} from "framework7-react";
import {Verified} from "./Common";
import {formatDate} from "../helpers/date";
import {StringToHtml} from "../helpers/parser";

export const PostMedia = ({ index, media, post }: { index: number, media: Media, post: Post }) => (
    <div key={index} className="max-w-72">
        {media.type === 'image' && (
            <PostImage url={media.url} post={post} />
        )}
        {(
            media.type.includes('roundvideo') ||
            media.type.includes('video') ||
            media.type.includes('gif') ||
            (media.type.includes('sticker') && media.url.includes(".webm") && media.thumb)
        ) && (
            <PostVideo url={media.url} thumb={media.thumb} post={post} roundvideo={media.type === 'roundvideo'} />
        )}
        {media.type === 'voice' && (
            <PostAudio url={media.url} />
        )}
    </div>
);

export const PostImage = ({ url, post }: { url: string, post: Post }) => (
    <img
        src={url}
        alt="Media"
        className={`rounded-xl w-full ${post.content?.text?.string ? 'mt-2' : ''}`}
        draggable="false"
    />
);

export const PostVideo = ({ url, thumb, post, roundvideo }: {
    url: string, thumb: string | undefined, post: Post, roundvideo: boolean
}) => (
    <video
        className={`w-full ${roundvideo ? 'rounded-full' : 'rounded-xl'} ${post.content?.text?.html ? 'mt-2' : ''}`}
        poster={thumb}
        controls
        muted
        autoPlay
        preload="auto"
    >
        <source src={url} type="video/mp4"/>
        <track src={undefined} kind="captions"/>
        Your browser does not support the video element.
    </video>
);

export const PostAudio = ({url}: { url: string }) => (
    <audio controls>
        <source src={url} type="audio/ogg"/>
        Your browser does not support the audio element.
    </audio>
);

export const PollFragment = ({poll}: { poll: Poll | undefined }) => (
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
                            <Progressbar progress={option.percent}/>
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
                    <Icon f7="person" size="14px" className="!align-baseline"/>
                </div>
                <div className="text-sm w-full whitespace-nowrap">
                    {footer.author}
                </div>
            </div>
        )}
    </div>
);

export const PostHead = ({channel, post}: { channel: Channel, post: Post }) => (
    <React.Fragment>
        <div>
            <div
                className="rounded-full w-12 h-12 bg-cover"
                style={{backgroundImage: `url(${channel.avatar})`}}>
            </div>
        </div>
        <div>
            <div className="font-bold text-white flex gap-1">
                <div className="whitespace-nowrap">
                    {channel.title}
                </div>
                <div>
                <Verified verified={!!channel.labels && channel.labels.includes("verified")}/>
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
                {post.content?.media && post.content.media.length > 0 &&
                    post.content.media.map((media, mediaIndex) => (
                        <PostMedia key={mediaIndex} index={mediaIndex} media={media} post={post} />
                    ))
                }
                <PollFragment poll={post.content?.poll} />
            </div>
            <div className="flex mt-3 h-4 w-full select-none text-neutral-400">
                <PostAuthor footer={post.footer} />
                <PostStats footer={post.footer} poll={post.content?.poll} />
            </div>
        </div>
    </div>
);
