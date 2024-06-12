import { Post } from "../../helpers/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { PostImage } from "./PostImage";
import { PostVideo } from "./PostVideo";
import { PostAudio } from "./PostAudio";

export const PostMedia = ({ post }: { post: Post }) => (
    <Swiper
        className="rounded-lg"
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true }}
        slidesPerView={1}
        centeredSlides
        loop
    >
        {post.content?.media?.map((media, mediaIndex) => (
            <SwiperSlide key={mediaIndex}>
                {media.type === 'image' && (
                    <div className="pb-10">
                        <PostImage url={media.url} post={post} />
                    </div>
                )}
                {['roundvideo', 'video', 'gif', 'sticker'].some(type => media.type.includes(type)) && (
                    <div className={
                        `w-10/12 md:w-3/5 m-auto ${post.content?.media?.length === 1 ? 'p-0' : 'py-10'}`
                    }>
                        <PostVideo
                            url={media.url} thumb={media.thumb}
                            disableRound={post.content?.media?.length === 1}
                            roundvideo={media.type === 'roundvideo'}
                        />
                    </div>
                )}
                {media.type === 'voice' && <PostAudio url={media.url} />}
            </SwiperSlide>
        ))}
    </Swiper>
);
