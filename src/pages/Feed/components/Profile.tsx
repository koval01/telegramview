import React from "react";
import { Channel } from "../helpers/types";
import {ChannelTitle} from "./Channel";

export const Profile = ({ channel }: { channel: Channel }) => (
    <div className="m-auto flex select-none">
        <ProfileAvatar avatar={channel.avatar}/>
        <div className="ml-3 w-full">
            <div className="text-2xl font-extrabold flex gap-1">
                <ChannelTitle title={channel.title || ""} labels={channel.labels} />
            </div>
            <ProfileDescription username={channel.username} description={channel.description} />
            <ProfileCounters counters={channel.counters} />
        </div>
    </div>
);

export const ProfileAvatar = ({avatar}: { avatar: string | undefined }) => (
    <div className="shrink-0">
        {avatar ? (
            <img className="w-24 h-24 rounded-full" src={avatar} alt="Avatar"
                 draggable="false"/>
        ) : (
            <div className="w-24 h-24 rounded-full bg-neutral-500"></div>
        )}
    </div>
);

export const ProfileDescription = (
    { username, description }: {
        username: string | undefined,
        description: string | undefined
    }) => (
    <React.Fragment>
        <div className="text-lg text-neutral-400">{username || ''}</div>
        <div className="text-sm mt-3">{description || ''}</div>
    </React.Fragment>
);

export const ProfileCounters = (
    {counters}: {
        counters: Record<string, number> | undefined
    }) => (
    <React.Fragment>
        {counters && (
            <div className="flex mt-2 gap-2">
                {Object.entries(counters).map(([key, value]) => (
                    <div className="mr-4" key={key}>
                        <div className="text-lg font-bold">{value}</div>
                        <div className="text-neutral-300 text-sm">{key}</div>
                    </div>
                ))}
            </div>
        )}
    </React.Fragment>
);
