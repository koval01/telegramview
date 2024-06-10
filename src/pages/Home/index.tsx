import { Page, Navbar, Subnavbar } from 'framework7-react';
import Searchbar from './components/Searchbar';
import ChannelList from './components/ChannelList';
import useChannelSearch from './helpers/useChannelSearch/hook';
import {useRefreshList} from "./helpers/useRefreshList/hook";

export default function Home() {
    const {
        filteredChannels,
        loading,
        handleSearchChange,
        handleAvatarError,
        searchAction,
        onPageBeforeRemove,
        onPageBeforeOut
    } = useChannelSearch();
    const { refreshData } = useRefreshList();

    return (
        <Page
            onPageBeforeRemove={onPageBeforeRemove}
            onPageBeforeOut={onPageBeforeOut}
            ptr
            ptrMousewheel={true}
            onPtrRefresh={refreshData}
            className="mt-4"
        >
            <Navbar title="Telegram View" className="select-none">
                <Subnavbar inner={false}>
                    <Searchbar
                        onChange={handleSearchChange}
                        onClick={() => { searchAction().then() }}
                    />
                </Subnavbar>
            </Navbar>
            <ChannelList
                filteredChannels={filteredChannels}
                loading={loading}
                handleAvatarError={handleAvatarError}
            />
            <div className="text-center text-neutral-700 select-none">
                {__CF_PAGES_COMMIT_SHA__ && <span>build:{__CF_PAGES_COMMIT_SHA__.slice(0, 7)}</span>}
            </div>
        </Page>
    );
}
