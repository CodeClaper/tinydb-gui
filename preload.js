const { contextBridge, ipcRenderer } = require('electron')

const channels = []
contextBridge.exposeInMainWorld('ipcRender', {
    send: (channel, args) => {
        ipcRenderer.send(channel, args)
    },
    receive: (channel, listener) => {
        ipcRenderer.on(channel, (event, args) => {
            listener(event, args)
        })
    },
    invoke: (channel, args) => {
        if (['createSocket', 'showTables', 'execSql', 'closeClient'].includes(channel)) {
            ipcRenderer.invoke(channel, args)
        }
    }
})

