import { App, NavRight, Panel, View, Page, Navbar, Block, Button, Popup, Link } from 'framework7-react';

export default function Application () {
    return (
        <App theme="ios" name="Telegram">

            {/* Left Panel with "cover" effect */}
            <Panel left cover>
                <View>
                    <Page>
                        <Navbar title="Left Panel"></Navbar>
                        <Block>
                            <p>Here comes the left panel text</p>
                        </Block>
                    </Page>
                </View>
            </Panel>

            {/* Right Panel with "reveal" effect */}
            <Panel right reveal>
                <View>
                    <Page>
                        <Navbar title="Right Panel"></Navbar>
                        <Block>
                            <p>Here comes the right panel text</p>
                        </Block>
                    </Page>
                </View>
            </Panel>

            {/*  Main view */}
            <View main>
                <Page>
                    <Navbar title="Telegram"></Navbar>
                    {/* Page content */}
                    <Block>
                        <p>Here comes main view page text</p>
                    </Block>
                    {/* Buttons to open panels */}
                    <Block className="grid grid-cols-2 grid-gap">
                        <Button panelOpen="left">Left Panel</Button>
                        <Button panelOpen="right">Right Panel</Button>
                    </Block>
                    {/* Button to open popup */}
                    <Button popupOpen="#my-popup">Open Popup</Button>
                </Page>
            </View>

            {/* Popup. All modals should be outside of Views */}
            <Popup id="my-popup">
                <View>
                    <Page>
                        <Navbar title="Popup">
                            {/* Link to close popup */}
                            <NavRight>
                                <Link popupClose>Close</Link>
                            </NavRight>
                        </Navbar>
                        <Block>
                            <p>Here comes popup text</p>
                        </Block>
                    </Page>
                </View>
            </Popup>
        </App>
    )
}
