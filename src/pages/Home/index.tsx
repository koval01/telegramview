import { Page, Navbar, Subnavbar } from 'framework7-react';
import Searchbar from './components/Searchbar';
import ChannelList from './components/ChannelList';
import useChannelSearch from './helpers/useChannelSearch';

export default function Home() {
    const { filteredChannels, loading, handleSearchChange, handleAvatarError, searchAction } = useChannelSearch();

    return (
        <Page>
            <Navbar title="Telegram View">
                <Subnavbar inner={false}>
                    <Searchbar onChange={handleSearchChange} onClick={() => { searchAction().then() }} />
                </Subnavbar>
            </Navbar>
            <ChannelList
                filteredChannels={filteredChannels}
                loading={loading}
                handleAvatarError={handleAvatarError}
            />
        </Page>
    );
}
