import { useEffect } from 'react';
import store from '../../../../store';
import { useSearchLogic } from './searchLogic';
import { useAvatarErrorHandling } from './avatarErrorHandling';
import { usePageLifecycleManagement } from './pageLifecycleManagement';
import { loadChannelsFromStorage, saveChannelsToStorage } from './storageManagement';

export default function useChannelSearch() {
    const { searchQuery, filteredChannels, loading, handleSearchChange, searchAction } = useSearchLogic();
    const { handleAvatarError } = useAvatarErrorHandling();
    const { onPageBeforeOut, onPageBeforeRemove } = usePageLifecycleManagement();
    const channels = store.state.channels;

    useEffect(() => {
        searchAction(searchQuery).then();
        saveChannelsToStorage(channels);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channels]);

    useEffect(() => loadChannelsFromStorage(), []);

    return { searchQuery, filteredChannels, loading, handleSearchChange, handleAvatarError, searchAction, onPageBeforeOut, onPageBeforeRemove };
}
