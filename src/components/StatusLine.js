import { useEffect, useState } from "react"
const ipcRenderer = window.ipcRender

function StatusLine() {
    const [status, setStatus] = useState(false)
    useEffect(() => {
        ipcRenderer.receive('connect', (event, message) => {
            setStatus(true)
        })
    }, [])
    useEffect(() => {
        ipcRenderer.receive('error', (event, message) => {
            setStatus(false)
        })
    }, [])
    return (
        <div className="status-line">
            <div className="connect-status">
                {status ? 'Connected' : 'Disconnected'}
            </div>
        </div>
    )
}

export default StatusLine
