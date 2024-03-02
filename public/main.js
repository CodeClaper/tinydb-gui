const { app, BrowserWindow } = require('electron/main')
const path = require('path')
const isDev = require('electron-is-dev')
const { installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer')
const { ipcMain } = require('electron')
const net = require('net')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        webPreferences: {
            preload: path.join(__dirname, '../preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableWebSQL: true,
            sandbox: false
        },
        autoHideMenuBar: true
    })
    win.loadURL(
        isDev
            ? "http://localhost:3000" 
            : `file://${path.join(__dirname, '../build/index.html')}`
    )
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

/**
 * Create Socket Client.
 */
ipcMain.handle('createSocket', (event, message) => {
    console.log(message)
    const socket = new net.Socket()
    socket.connect(message.port, message.host)
    socket.on('connect', () => {
        socketClient = socket
        event.sender.send("connect", "Connected")
    })
    socket.on('error', () => {
        event.sender.send("error", "Conntect fail")
    })
    socket.end()
})

ipcMain.handle('showTables', (event, message) => {
    const socket = new net.Socket()
    socket.connect(4083, '127.0.0.1')
    socket.write("show tables")
    var buffer = ''
    socket.on('data', (buff) => {
        var str = clearBuffer(buff)
        if (str.toUpperCase().endsWith("OVER")) {
            buffer = buffer.concat(str.replace("OVER", ""))
            event.sender.send('tables', buffer)
            buffer = ''
            str = ''
        }
        else
            buffer = buffer.concat(str)
    })
})


ipcMain.handle('execSql', (event, message) => {
    const socket = new net.Socket()
    socket.connect(4083, '127.0.0.1')
    socket.write(message)
    var buffer = ''
    socket.on('data', (buff) => {
        var str = clearBuffer(buff)
        if (str.toUpperCase().endsWith("OVER")) {
            buffer = buffer.concat(str.replace("OVER", ""))
            event.sender.send('data', buffer)
            buffer = ''
            str = ''
        }
        else
            buffer = buffer.concat(str)
    })
})

function clearBuffer(buff) {
    var resultBuffer = Buffer.alloc(0);

    for (let i = 0; i < buff.length; i++) {
        const byte = buff.readUint8(i)
        if (byte !== 0x00)
            resultBuffer = Buffer.concat([resultBuffer, Buffer.from([byte])])
    }

    return resultBuffer.toString('utf-8')
}
