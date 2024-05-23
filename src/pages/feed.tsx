import { useEffect, useState } from 'react'
import { Page, Block, Card, CardContent, CardHeader } from 'framework7-react'
import axios from 'axios'

interface FeedProps {
    channelId: string,
    postId?: number,
}

interface Post {
    id: string
    title: string
    content: {
        text?: {
            html?: string
        }
        media?: [
            {
                url: string
                type: string
            }
        ]
    }
}

export default function Feed({ channelId, postId }: FeedProps) {
    const [showPreloader, setShowPreloader] = useState(true)
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(
                    `https://tme.koval.page/v1/body/${channelId}`, {
                        params: {
                            position: postId ? postId : null,
                        }
                    })
                setPosts(response.data.content.posts)
            } catch (err) {
                setError('Error fetching posts. Error: ' + err)
            } finally {
                setLoading(false)
            }
            setShowPreloader(false);
        }

        fetchPosts()
    }, [channelId, postId])

    if (loading) {
        return (
            <Page>
                <Block>Loading...</Block>
            </Page>
        )
    }

    if (error) {
        return (
            <Page>
                <Block>{error}</Block>
            </Page>
        )
    }

    return (
        <Page infinite infiniteDistance={50} infinitePreloader={showPreloader} onInfinite={() => {console.log("inf")}}>
            <Block>
                <h1>Posts for channel {channelId}</h1>
                {posts.map((post) => (
                    <Card outline key={post.id}>
                        <CardHeader
                            style={{
                                backgroundImage: `url(${post.content?.media?.[0]?.url})`,
                            }}
                        >
                            <div style={{
                                height: "200px"
                            }}></div>
                        </CardHeader>
                        <CardContent>
                            <div dangerouslySetInnerHTML={{ __html: post.content?.text?.html || '' }} />
                        </CardContent>
                    </Card>
                ))}
            </Block>
        </Page>
    )
}
