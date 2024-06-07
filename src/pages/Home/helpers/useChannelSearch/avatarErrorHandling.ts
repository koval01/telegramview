import { useRef } from 'react';
import { useSearchLogic } from './searchLogic';
import { UpdateChannel } from './types';

export function useAvatarErrorHandling() {
    const updateTimeout = useRef<UpdateChannel>({});
    const { searchAction } = useSearchLogic();

    const handleAvatarError = async (username: string) => {
        if (updateTimeout.current[username]) return;
        const destructTimeout = () => clearTimeout(updateTimeout.current[username]);
        const callUpdate = () => searchAction(username, true, destructTimeout);

        updateTimeout.current[username] = setTimeout(callUpdate, 3000);
        await callUpdate();
    };

    return { handleAvatarError };
}
