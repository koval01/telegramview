import React from "react";
import {Verified} from "./Common";

export const ChannelTitle = (
    { title, labels, badgeSize = 28 }: { title: string, labels?: string[], badgeSize?: number }
) => (
    <React.Fragment>
        <div>{title}</div>
        <div>
            <Verified verified={!!labels && labels.includes("verified")} size={badgeSize} />
        </div>
    </React.Fragment>
);
