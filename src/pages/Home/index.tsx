import { Page, Navbar, Subnavbar } from 'framework7-react';
import Searchbar from './components/Searchbar';
import ChannelList from './components/ChannelList';
import useChannelSearch from './helpers/useChannelSearch/hook';

export default function Home() {
    const { filteredChannels, loading, handleSearchChange, handleAvatarError, searchAction, onPageBeforeRemove, onPageBeforeOut } = useChannelSearch();

    return (
        <Page onPageBeforeRemove={onPageBeforeRemove} onPageBeforeOut={onPageBeforeOut}>
            <Navbar title="Telegram View" className="select-none">
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
