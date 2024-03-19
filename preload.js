const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRender', {
    send: (channel, args) => {
        ipcRenderer.send(channel, args)
    },
    receive: (channel, listener) => {
        return ipcRenderer.on(channel, listener) 
    },
    once: (channel, listener) => {
        ipcRenderer.once(channel, listener) 
    },
    off: (channel, listener) => {
        ipcRenderer.removeListener(channel, listener)
    },
    invoke: (channel, args) => {
        if (['createSocket', 'showTables', 'execSql', 'closeClient'].includes(channel)) {
            ipcRenderer.invoke(channel, args)
        }
    }
})

