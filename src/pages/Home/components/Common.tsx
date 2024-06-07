import {Preloader} from "framework7-react";
import VerifiedIcon from "../../../icons/VerifiedIcon.tsx";

interface AvatarProps {
    avatar: string;
    title: string;
    username: string;
    onError: (username: string) => void;
}

const Loader = () => {
    return (
        <div className="mt-8">
            <Preloader size={36} className="block m-auto"/>
        </div>
    );
}

const Empty = () => {
    return (
        <span className="text-neutral-400 text-center block m-auto mt-4">
            list is empty
        </span>
    )
}

const Title = ({ title, isVerified }: { title: string, isVerified: boolean }) => {
    return (
        <div className="flex gap-0.5">
            <div>{title}</div>
            {isVerified && (
                <div>
                    <VerifiedIcon className="w-6 h-6"/>
                </div>
            )}
        </div>
    );
}

const Avatar = ({ avatar, title, username, onError }: AvatarProps) => {
    return (
        <img
            src={avatar}
            alt={`${title}'s avatar`}
            className="icon w-12 h-12 rounded-full"
            draggable="false"
            onError={() => onError(username)}
        />
    );
}

const AvatarSkeleton = () => {
    return (
        <div className="w-12 h-12 rounded-full bg-neutral-500"></div>
    );
}

export { Loader, Empty, Title, Avatar, AvatarSkeleton };
