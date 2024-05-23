import { Page, Block, Navbar } from 'framework7-react'

export default function NotFound() {
    return (
        <Page>
            <Navbar title="Not found" backLink="Back"></Navbar>
            <Block>
                <p>Sorry</p>
                <p>Requested content not found.</p>
            </Block>
        </Page>
    )
}
