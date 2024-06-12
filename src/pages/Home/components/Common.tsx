import {Icon, Preloader} from "framework7-react";

interface AvatarProps {
    avatar: string;
    title: string;
    username: string;
    onError: (username: string) => void;
}

const Loader = () => (
    <div className="block m-auto max-w-0 mt-4">
        <Preloader size={30} />
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
                <Icon
                    size={17}
                    f7="checkmark_seal_fill"
                    className="!align-baseline text-blue-400"
                />
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
