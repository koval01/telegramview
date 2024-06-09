import {useRef, useState} from 'react';
import {Channel, UpdateChannel} from './types';
import store from "../../../../store.ts";
import {useToast, openDialogLoading} from "./toastManagement.ts";

export function useAvatarErrorHandling() {
    const updateTimeout = useRef<UpdateChannel>({});
    const [loading, setLoading] = useState(false);
    const channels = store.state.channels as Channel[];
    const { showToastCenter } = useToast();

    const callUpdate = async (onCallback?: () => void) => {
        await store.dispatch('fetchChannels', {
            usernames: channels.map(channel => channel.username),
            onCallback: onCallback,
            onErrorCallback: () => showToastCenter(`Failed to update channels`)
        });
    };

    const handleAvatarError = async (username: string) => {
        if (updateTimeout.current[username]) return;
        if (loading) return;
        setLoading(true);

        const loadingDialog = openDialogLoading();

        const destructTimeout = () => clearTimeout(updateTimeout.current[username]);
        const finish = () => setLoading(false);

        const internalCallUpdate = () => callUpdate(() => {
            destructTimeout();
            loadingDialog();
            finish();
        });

        updateTimeout.current[username] = setTimeout(internalCallUpdate, 3000);
        await internalCallUpdate();
    };

    return { handleAvatarError };
}
