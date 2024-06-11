import React from "react";
import {Icon} from "framework7-react";

export const Verified = ({ verified, size = 16 }: { verified: boolean, size?: number }) => (
    <React.Fragment>
        {verified && (
            <Icon f7="checkmark_seal_fill" size={`${size}px`} className="!align-baseline text-blue-400" />
        )}
    </React.Fragment>
);
