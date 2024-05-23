import {Page, Block, Navbar, NavRight, Link, Searchbar} from 'framework7-react'

export default function Home() {
    return (
        <Page>
            <Navbar title="Searchbar">
                <NavRight>
                    <Link searchbarEnable=".searchbar" iconIos="f7:search" iconMd="material:search" />
                </NavRight>
                <Searchbar
                    className="searchbar"
                    expandable
                    searchContainer=".search-list"
                    searchIn=".item-title"
                />
            </Navbar>
            <Block>
                <p>Sorry</p>
                <p>Requested content not found.</p>
            </Block>

        </Page>
    )
}

