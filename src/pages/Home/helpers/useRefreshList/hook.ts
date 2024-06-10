import store from "../../../../store";
import {Channel} from "../types";
import {useToast} from "../useToast/hook";

export function useRefreshList() {
    const channels = store.state.channels as Channel[];
    const { showToastCenter } = useToast();

    const refreshData = async (done: () => void) => {
        await callUpdate();
        done();
    };

    const callUpdate = async (onCallback?: () => void) => {
        await store.dispatch('fetchChannels', {
            usernames: channels.map(channel => channel.username),
            onCallback: onCallback,
            onErrorCallback: () => showToastCenter("Failed to update channels")
        });
    };

    return { callUpdate, refreshData };
}