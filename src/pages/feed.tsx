import { useEffect, useState } from 'react'
import { Page, Block, Card, CardContent } from 'framework7-react'
import axios from 'axios'

interface FeedProps {
    channelId: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
}

export default function Feed({ channelId }: FeedProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`https://tme.koval.page/v1/body/${channelId}`);
                setPosts(response.data.content.posts);
            } catch (err) {
                setError('Error fetching posts. Error: ' + err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [channelId]);

    if (loading) {
        return (
            <Page>
                <Block>Loading...</Block>
            </Page>
        );
    }

    if (error) {
        return (
            <Page>
                <Block>{error}</Block>
            </Page>
        );
    }

    return (
        <Page>
            <Block>
                <h1>Posts for channel {channelId}</h1>
                {posts.map((post) => (
                    <Card outline key={post.id}>
                        <CardContent>
                            <div dangerouslySetInnerHTML={{__html: post.content.text?.html || ''}}/>
                        </CardContent>
                    </Card>
                ))}
            </Block>
        </Page>
    );
}
