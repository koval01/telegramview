import { Post } from "../../helpers/types";

export const PostImage = ({ url, post }: { url: string, post: Post }) => (
    <img
        src={url}
        alt="Media"
        draggable="false"
        className={
            `rounded-xl m-auto ${post.content?.text?.string ? 'mt-2' : ''}`
        }
    />
);
