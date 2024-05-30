import { useEffect } from 'react'
import { blockContextMenu, detectDevTools, removeContextMenuBlock, removeDevToolsDetection } from './devTools'

import { App, View } from 'framework7-react'

import Home from './pages/Home'
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

const devToolsPrevent = () => {
    blockContextMenu()
    detectDevTools()

    return () => {
        removeContextMenuBlock()
        removeDevToolsDetection()
    }
}

export default function Application () {
    useEffect(() => process.env.NODE_ENV === 'production' ? devToolsPrevent() : void 0, [])

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
