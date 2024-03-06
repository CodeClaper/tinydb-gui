import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { useEffect, useState } from 'react'
const ipcRenderer = window.ipcRender

window.conn = {
    name: 'dev',
    host: '127.0.0.1',
    port: 4083,
    connected: false
}

function Connector({visible, onHidden}) {
    const[name, setName] = useState(window.conn.name)
    const[host, setHost] = useState(window.conn.host)
    const[port, setPort] = useState(window.conn.port)
    useEffect(() => {
        window.conn.name = name
        window.conn.host = host
        window.conn.port = port
    }, [name, host, port])
    const tryConnect = () => {
        ipcRenderer.invoke('createSocket', window.conn)
    }
    const tryShowTables = () => {
        ipcRenderer.invoke('showTables', window.conn)
        onHidden()
    }
    return (
        <Dialog header="新建连接" visible={visible} style={{ width: '500px' }} onHide = {onHidden}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faLink} size="3x" style={{ color: "#74C0Fc"}}/>
                <div className="flex flex-column gap-2" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                    <label htmlFor="name">连接名</label>
                    <InputText id="name" value={ name } onChange={(e) => setName(e.target.value)} aria-describedby="name-help" className="p-inputtext-sm"/>
                </div>
                <div className="flex flex-column gap-2" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                    <label htmlFor="host">主机</label>
                    <InputText id="host" value={ host } onChange={(e) => setHost(e.target.host)} aria-describedby="name-help" className="p-inputtext-sm"/>
                </div>
                <div className="flex flex-column gap-2" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                    <label htmlFor="port">端口</label>
                    <InputNumber id="port" value={port} onChange={(e) => setPort(e.value)} aria-describedby="port-help" className="p-inputtext-sm" useGrouping={false} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px', gap: '10px'}}>
                    <Button label="测试连接" severity="secondary" outlined size="small" style={{ width: '200px'}} onClick={ tryConnect }/>
                    <div>
                        <Button label="取消" severity="secondary" outlined size="small" onClick={ onHidden }/>
                        <Button label="确定" size="small" style={{ marginLeft: '10px'}} onClick={ tryShowTables }/>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default Connector
