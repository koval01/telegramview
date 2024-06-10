import {useRef, useState} from 'react';
import {UpdateChannel} from '../types';
import {useToast} from "../useToast/hook";
import {useRefreshList} from "../useRefreshList/hook";

export function useAvatarErrorHandling() {
    const updateTimeout = useRef<UpdateChannel>({});
    const [loading, setLoading] = useState(false);

    const { openDialogLoading } = useToast();
    const { callUpdate } = useRefreshList();

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
