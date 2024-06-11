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
        <Popup push className="profile-info-popup" opened={popupOpened} onPopupClosed={() => setPopupOpened(false)}>
            <View>
                <Page>
                    <Navbar title="Channel profile" large transparent>
                        <NavRight>
                            <Link popupClose>Close</Link>
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
