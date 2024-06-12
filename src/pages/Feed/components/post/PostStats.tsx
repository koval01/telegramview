import { Footer, Poll } from "../../helpers/types";
import { Icon } from "framework7-react";

export const PostStats = ({ footer, poll }: { footer: Footer, poll?: Poll }) => (
    <div className="relative flex flex-row justify-end items-end right-0 w-full">
        {footer.views && (
            <div className="flex gap-2">
                {poll && (
                    <div className="flex gap-1">
                        <div>
                            <Icon f7="checkmark_square_fill" size="14px" className="!align-baseline" />
                        </div>
                        <div className="text-sm">
                            {poll.votes}
                        </div>
                    </div>
                )}
                <div className="flex gap-1">
                    <div>
                        <Icon f7="eye_fill" size="14px" className="!align-baseline" />
                    </div>
                    <div className="text-sm">
                        {footer.views}
                    </div>
                </div>
            </div>
        )}
    </div>
);
