const { app, BrowserWindow } = require('electron/main')
const path = require('path')
const isDev = require('electron-is-dev')
const { ipcMain } = require('electron')
const net = require('net')
var socket = undefined

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 400,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
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
            : `file://${path.join(__dirname, './build/index.html')}`
    )
    if (isDev)
        win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


/**
 * New Socket.
 */
const newSocket = (event, conn) => {
    socket = new net.Socket()
    socket.connect(conn.port, conn.host)
    socket.on('connect', () => {
        event.sender.send("connect", "数据库连接成功")
    })
    socket.on('error', () => {
        event.sender.send("error", "数据库连接失败")
    })
    socket.on('close', () => {
        event.sender.send("close", "远程数据库关闭连接")
    })
    socket.on('end', () => {
        event.sender.send("end", "连接关闭")
    })
}

/**
 * Create Socket Client Listener
 */
ipcMain.handle('createSocket', (event, message) => {
    newSocket(event, message)
})

/**
 * Show tables to get all tables info.
 */
ipcMain.handle('showTables', (event, message) => {
    var buffer = ''
    if (!socket) {
        newSocket(event, message)
    }
    socket.write("show tables")
    socket.removeAllListeners('data')
    socket.on('data', (buff) => {
        var str = cleanBuffer(buff)
        if (str.toUpperCase().endsWith("OVER")) {
            buffer = buffer.concat(str.replace("OVER", ""))
            event.sender.send('tables', buffer)
            buffer = ''
            str = ''
        }
        else
            buffer = buffer.concat(str)
    })
    socket.on('error', () => {
        event.sender.send("error", "数据库连接失败")
    })
})

/**
 * Execute Sql
 * */
ipcMain.handle('execSql', (event, message) => {
    const client = getOrCreateSocket(message)
    var buffer = ''
    if (client) {
        client.write(message.sql)
        client.removeAllListeners('data')
        client.on('data', (buff) => {
            var str = cleanBuffer(buff)
            if (str.toUpperCase().endsWith("OVER")) {
                buffer = buffer.concat(str.replace("OVER", ""))
                event.sender.send(`${message.key}_data`, buffer)
                buffer = ''
                str = ''
            }
            else
                buffer = buffer.concat(str)
        })
    } else {
        throw new Error('Not found socket client')
    }
})

/*
 * Close Socket Client.
 * */
ipcMain.handle('closeClient', (event, workerKey) => {
    removeSocket(workerKey)
})

const sockerList = []

function getOrCreateSocket(worker) {
    for (let i = 0; i < sockerList.length; i++) {
        if (sockerList[i].workerId === worker.key) {
            return sockerList[i].client
        }
    }
    const client = new net.Socket()
    client.connect(worker.conn.port, worker.conn.host)
    sockerList.push({
        workerId: worker.key,
        client: client
    })
    return client;
}

function removeSocket(workerKey) {
    debugger
    for(let i = 0; i < sockerList.length; i++) {
        if (sockerList[i].workerId === workerKey) {
            const client = sockerList[i].client
            client.end()
            sockerList.splice(i, 1)
            return true
        }
    }
    return false
}

/**
 * Clean buffer and Get String. 
 */
function cleanBuffer(buff) {
    var resultBuffer = Buffer.alloc(0);

    for (let i = 0; i < buff.length; i++) {
        const byte = buff.readUint8(i)
        if (byte !== 0x00)
            resultBuffer = Buffer.concat([resultBuffer, Buffer.from([byte])])
    }

    return resultBuffer.toString('utf-8')
}
