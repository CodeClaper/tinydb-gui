const { channel } = require('diagnostics_channel')
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRender', { 
    send: (channel, args) => {
        ipcRenderer.send(channel, args)
    },
    receive: (channel, listener) => {
        ipcRenderer.on(channel, (event, args) => {
            listener(event, args)
            ipcRenderer.removeListener(channel, listener)
        })
    },
    invoke: (channel, args) => {
        if (['createSocket', 'showTables', 'execSql'].includes(channel)) {
            ipcRenderer.invoke(channel, args)
        }
    }
})

