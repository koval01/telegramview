import React from "react";
import { Channel, Post } from "../../helpers/types";
import { Verified } from "../Common";
import { formatDate } from "../../helpers/date";

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
