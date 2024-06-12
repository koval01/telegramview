export const PostVideo = ({ url, thumb, roundvideo, disableRound }: {
    url: string, thumb: string | undefined, roundvideo: boolean, disableRound: boolean
}) => (
    <video
        className={`m-auto ${roundvideo ? 'rounded-full' : !disableRound ? 'rounded-xl' : ''}`}
        poster={thumb}
        controls
        preload="auto"
        style={{ width: '100%', height: 'auto', zIndex: 1, position: 'relative' }}
    >
        <source src={url} type="video/mp4" />
        <track kind="captions" />
        Your browser does not support the video element.
    </video>
);
