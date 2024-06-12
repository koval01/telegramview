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
                        `w-10/12 md:w-3/5 m-auto relative ${post.content?.media?.length === 1 ? 'p-0' : 'py-10'}`
                    }>
                        <div className={
                            "fixed left-0 w-full h-full bg-center blur-md"
                        } style={{
                            backgroundImage: `url(${media.thumb})`,
                            backgroundSize: "120%"
                        }}></div>
                        <div className="fixed left-0 w-full h-full bg-black opacity-30"></div>
                        <div className="py-14">
                             <PostVideo
                                url={media.url} thumb={media.thumb}
                                roundvideo={media.type === 'roundvideo'}
                            />
                        </div>
                    </div>
                )}
                {media.type === 'voice' && <PostAudio url={media.url} />}
            </SwiperSlide>
        ))}
    </Swiper>
);
