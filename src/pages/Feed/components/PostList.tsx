import React from 'react';
import { Channel, Post } from '../helpers/types';
import {PostFragment} from './Post';

interface PostListProps {
    posts: Post[];
    channel: Channel;
}

const PostList: React.FC<PostListProps> = ({ posts, channel }) => {
    return (
        <div className="w-full md:max-w-[680px] lg:max-w-[720px] xl:max-w-[780px] 2xl:max-w-[840px] p-0 mt-8 block m-auto">
            {posts.map((post) => (
                <React.Fragment key={post.id}>
                    <PostFragment post={post} channel={channel} />
                </React.Fragment>
            ))}
        </div>
    );
};

export default PostList;
