import React from "react";
import { Channel, Post } from "../../helpers/types";
import { StringToHtml } from "../../helpers/parser";
import { PostHead } from "./PostHead";
import { PostMedia } from "./PostMedia";
import { PostPoll } from "./PostPoll";
import { PostAuthor } from "./PostAuthor";
import { PostStats } from "./PostStats";

export const PostFragment: React.FC<{
    channel: Channel; post: Post
}> = ({ channel, post }) => (
    <div className="p-4 mt-5 bg-neutral-900 relative md:rounded-xl">
        <div>
            <div className="flex gap-2 select-none">
                <PostHead channel={channel} post={post} />
            </div>
            <div className="mt-2">
                {post.content?.text?.string && <StringToHtml text={post.content.text.string} />}
                <div className="mt-3">
                    <PostMedia post={post} />
                </div>
                <PostPoll poll={post.content?.poll} />
            </div>
            <div className="flex mt-3 h-4 w-full select-none text-neutral-400">
                <PostAuthor footer={post.footer} />
                <PostStats footer={post.footer} poll={post.content?.poll} />
            </div>
        </div>
    </div>
);
