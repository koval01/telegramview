export const blockContextMenu = () => {
    document.addEventListener('contextmenu', (event) => event.preventDefault())
}

export const detectDevTools = () => {
    let devtoolsOpen = false

    const checkStatus = (e: KeyboardEvent) => {
        if (
            (e.code === 'KeyI' && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
            e.code === 'F12'
        ) {
            devtoolsOpen = true
            alert('Developer tools are not allowed!')
        }
    }

    window.addEventListener('keydown', checkStatus)

    // Detect dev tools open using the console API
    const element = new Image()
    Object.defineProperty(element, 'id', {
        get: function () {
            devtoolsOpen = true
            alert('Developer tools are not allowed!')
        }
    })
    console.log('%c', element)

    return devtoolsOpen
}

export const removeContextMenuBlock = () => {
    document.removeEventListener('contextmenu', (event) => event.preventDefault())
}

export const removeDevToolsDetection = () => {
    window.removeEventListener('keydown', (e: KeyboardEvent) => {
        if (
            (e.code === 'KeyI' && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
            e.code === 'F12'
        ) {
            alert('Developer tools are not allowed!')
        }
    })
}
