import { App, View } from 'framework7-react';

import Home from './pages/home.tsx'
import Feed from './pages/feed.tsx'
import NotFound from './pages/notfound.tsx'

const f7params = {
    name: 'Telegram',
    theme: 'ios',
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/feed/:channelId',
            component: Feed,
        },
        {
            path: '(.*)',
            component: NotFound,
        }
    ],
};

export default function Application () {
    return (
        <App { ...f7params }>
            <View main url={location.pathname} />
        </App>
    )
}
