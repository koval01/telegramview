export const PostAudio = ({ url }: { url: string }) => (
    <audio className="m-auto" controls>
        <source src={url} type="audio/ogg" />
        Your browser does not support the audio element.
    </audio>
);
