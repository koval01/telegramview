import { Footer } from "../../helpers/types";
import { Icon } from "framework7-react";

export const PostAuthor = ({ footer }: { footer: Footer }) => (
    <div className="relative flex flex-row justify-start items-end">
        {footer.author && (
            <div className="flex gap-1">
                <div>
                    <Icon f7="person" size="14px" className="!align-baseline" />
                </div>
                <div className="text-sm w-full whitespace-nowrap">
                    {footer.author}
                </div>
            </div>
        )}
    </div>
);
