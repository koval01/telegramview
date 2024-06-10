import { useToast } from '../useToast/hook';
import { f7 } from "framework7-react";

export function usePageLifecycleManagement() {
    const { toastCenter } = useToast();

    const onPageBeforeOut = () => {
        // @ts-expect-error: In the documentation, this method is used without arguments
        f7.toast.close();
    };

    const onPageBeforeRemove = () => {
        if (toastCenter.current) toastCenter.current.destroy();
    };

    return { onPageBeforeOut, onPageBeforeRemove };
}
