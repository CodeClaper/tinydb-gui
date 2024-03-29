import { useRef, useEffect } from 'react'
import { Toast } from 'primereact/toast'

const ipcRenderer = window.ipcRender

function Message({reload}) {
    const toast = useRef(null)
    useEffect(() => {
        ipcRenderer.receive('connect', (event, message) => {
            window.conn.connected = true
            reload({})
            toast.current.show(
                { severity: 'success', summary: 'Info', detail: message }
            )
        })
    }, [])
    useEffect(() => {
        ipcRenderer.receive('error', (event, message) => {
            window.conn.connected = false
            reload({})
            toast.current.show(
                { severity: 'error', summary: 'Info', detail: message }
            )
        })
    }, [])
    useEffect(() => {
        ipcRenderer.receive('close', (event, message) => {
            window.conn.connected = false
            reload({})
            toast.current.show(
                { severity: 'error', summary: 'Info', detail: message }
            )
        })
    }, [])
    useEffect(() => {
        ipcRenderer.receive('end', (event, message) => {
            window.conn.connected = false
            reload({})
            toast.current.show(
                { severity: 'error', summary: 'Info', detail: message }
            )
        })
    }, [])
    return (
        <Toast ref={toast} />
    )
}

export default Message
