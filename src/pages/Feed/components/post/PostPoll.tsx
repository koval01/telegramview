import React from "react";
import { Poll } from "../../helpers/types";
import { Progressbar } from "framework7-react";

export const PostPoll = ({ poll }: { poll: Poll | undefined }) => (
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
