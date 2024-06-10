import { Toast } from "framework7/types";
import { f7 } from "framework7-react";
import { useRef } from 'react';

export function useToast() {
    const toastCenter = useRef<Toast.Toast | null>(null);

    const showToastCenter = (message: string) => {
        if (!toastCenter.current) {
            toastCenter.current = f7.toast.create({
                text: message,
                position: 'center',
                closeTimeout: 2000,
            });
        }
        toastCenter.current.open();
    };

    const openDialogLoading = () => {
        f7.dialog.preloader();
        return () => f7.dialog.close();
    };

    return { showToastCenter, openDialogLoading, toastCenter };
}
