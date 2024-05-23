import { Page, Block } from 'framework7-react'

interface FeedProps {
    channelId: string;
}

export default function Feed({ channelId }: FeedProps) {
    return (
        <Page>
            <Block>
                <h1>called channelId {channelId}</h1>
            </Block>
        </Page>
    )
}
