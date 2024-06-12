import React from "react";
import {Link} from "framework7-react";

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
                <Link key={index} href={href} target="_blank" external className={
                    "truncate inline-block min-w-0 max-w-64 md:max-w-96 lg:max-w-[32rem]" +
                    "inline-block align-bottom text-blue-500 select-all"}>
                    {part}
                </Link>
            );
        }

        return part;
    });
};

export const StringToHtml = ({ text }: { text: string }) => {
    const lines = text.split('\n');

    const elements = lines.map((line, index) => (
        <React.Fragment key={index}>
            {convertLinksToJSX(line)}
            {index < lines.length - 1 && <br />}
        </React.Fragment>
    ));

    return <div>{elements}</div>;
};
