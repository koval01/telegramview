import React from 'react'
import { createRoot } from 'react-dom/client'

import Framework7 from 'framework7/lite/bundle'
import Framework7React from 'framework7-react'

import './sentry'

import App from './App'

import 'framework7/css/bundle'
import 'framework7-icons'

import './index.css'

Framework7.use(Framework7React)

createRoot(document.getElementById('root')!)
    .render(React.createElement(App))
