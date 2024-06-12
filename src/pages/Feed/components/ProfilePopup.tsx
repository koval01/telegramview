import React from 'react';
import {Block, Link, Navbar, NavRight, Page, Popup, View} from 'framework7-react';
import { Channel } from '../helpers/types';
import { Profile } from './Profile';

interface ProfilePopupProps {
    channel: Channel;
    popupOpened: boolean;
    setPopupOpened: (opened: boolean) => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ channel, popupOpened, setPopupOpened }) => {
    return (
        <Popup
            push
            closeOnEscape
            className="profile-info-popup border border-neutral-900 !rounded-2xl"
            opened={popupOpened}
            onPopupClosed={() => setPopupOpened(false)}
        >
            <View>
                <Page>
                    <Navbar title="Channel profile" large transparent>
                        <NavRight>
                            <Link popupClose className="mr-2">Close</Link>
                        </NavRight>
                    </Navbar>
                    <Block className="flex">
                        <Profile channel={channel} />
                    </Block>
                </Page>
            </View>
        </Popup>
    );
};

export default ProfilePopup;
