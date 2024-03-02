const { contextBridge, ipcRenderer } = require('electron')

const channels = []
contextBridge.exposeInMainWorld('ipcRender', {
    send: (channel, args) => {
        ipcRenderer.send(channel, args)
    },
    receive: (channel, listener) => {
        if (!channels.includes(channel)) {
            ipcRenderer.on(channel, (event, args) => {
                listener(event, args)
            })
            channels.push(channel)
        }
    },
    invoke: (channel, args) => {
        if (['createSocket', 'showTables', 'execSql'].includes(channel)) {
            ipcRenderer.invoke(channel, args)
        }
    }
})

