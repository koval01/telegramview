import { App, View } from 'framework7-react'

import Home from './pages/home.tsx'
import Feed from './pages/feed.tsx'

const f7params = {
    name: 'Telegram',
    theme: 'ios',
    darkMode: true,
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/:channelId',
            component: Feed,
        },
        {
            path: '/:channelId/:postId',
            component: Feed,
        },
        {
            path: '(.*)',
            component: Home,
        }
    ],
}

export default function Application () {
    return (
        <App { ...f7params }>
            <View
                main
                url="/"
                iosSwipeBack={true}
                preloadPreviousPage={false}
                browserHistory={true}
                browserHistoryRoot={''}
                browserHistorySeparator={''}
                browserHistoryAnimateOnLoad={true}
            />
        </App>
    )
}
