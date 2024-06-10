import {Preloader} from "framework7-react";
import VerifiedIcon from "../../../icons/VerifiedIcon";

interface AvatarProps {
    avatar: string;
    title: string;
    username: string;
    onError: (username: string) => void;
}

const Loader = () => (
    <div className="mt-8">
        <Preloader size={42} color="white" className="block m-auto"/>
    </div>
);

const Empty = () => (
    <span className="text-neutral-400 text-center block m-auto mt-4">
        list is empty
    </span>
);

const Title = ({ title, isVerified }: { title: string, isVerified: boolean }) => (
    <div className="flex gap-0.5">
        <div>{title}</div>
        {isVerified && (
            <div>
                <VerifiedIcon className="w-6 h-6"/>
            </div>
        )}
    </div>
);

const Avatar = ({ avatar, title, username, onError }: AvatarProps) => (
    <img
        src={avatar}
        alt={`${title}'s avatar`}
        className="icon w-12 h-12 rounded-full"
        draggable="false"
        onError={() => onError(username)}
    />
);

const AvatarSkeleton = () => (
    <div className="w-12 h-12 rounded-full bg-neutral-500"></div>
);

export { Loader, Empty, Title, Avatar, AvatarSkeleton };
