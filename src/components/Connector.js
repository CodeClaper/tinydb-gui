import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { InputNumber } from 'primereact/inputnumber'
import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import ConnContext from './ConnContext'
const ipcRenderer = window.ipcRender

function Connector({visible, onHidden}) {
    const [conn, setConn] = useState({})
    const formik = useFormik({
        initialValues: {
            name: 'dev',
            host: '127.0.0.1',
            port: 4083
        },
        onSubmit: (data) => {
            setConn(data)
        }
    })
    const toast = useRef(null)
    const tryConnect = async () => {
        await formik.handleSubmit()
        await ipcRenderer.invoke('createSocket', conn)
    }
    const tryShowTables = async() => {
        formik.handleSubmit()
        ipcRenderer.invoke('showTables', conn)
        onHidden()
    }
    useEffect(() => {
        ipcRenderer.receive('connect', (event, message) => {
            toast.current.show(
                { severity: 'success', summary: 'Info', detail: '连接数据库成功'}
            )
        })
        ipcRenderer.receive('error', (event, message) => {
            toast.current.show(
                { severity: 'error', summary: 'Info', detail: '连接数据库失败'}
            )
        })
    }, [])
    return (
        <ConnContext.Provider value={{ conn, setConn}}>
            <Dialog header="新建连接" visible={visible} style={{ width: '500px' }} onHide = {onHidden}>
                <form onSubmit={formik.handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <FontAwesomeIcon icon={faDatabase} size="3x" style={{ color: "#74C0Fc"}}/>
                        <div className="flex flex-column gap-2" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                            <label htmlFor="name">连接名</label>
                            <InputText id="name" value={ formik.values.name } onChange={(e) => formik.setFieldValue('name', e.target.value)} aria-describedby="name-help" className="p-inputtext-sm"/>
                        </div>
                        <div className="flex flex-column gap-2" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                            <label htmlFor="host">主机</label>
                            <InputText id="host" value={ formik.values.host } onChange={(e) => formik.setFieldValue('host', e.target.value)} aria-describedby="name-help" className="p-inputtext-sm"/>
                        </div>
                        <div className="flex flex-column gap-2" style={{ display: 'flex', flexDirection: 'column', marginTop: '10px'}}>
                            <label htmlFor="port">端口</label>
                            <InputNumber id="port" value={formik.values.port} onChange={(e) => formik.setFieldValue('port', e.value)} aria-describedby="port-help" className="p-inputtext-sm" useGrouping={false} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px', gap: '10px'}}>
                            <Button label="测试连接" severity="secondary" outlined size="small" style={{ width: '200px'}} onClick={ tryConnect }/>
                            <div>
                                <Button label="取消" severity="secondary" outlined size="small" onClick={ onHidden }/>
                                <Button label="确定" size="small" style={{ marginLeft: '10px'}} onClick={ tryShowTables }/>
                            </div>
                        </div>
                    </div>
                </form>
            </Dialog>
            <Toast ref={toast} />
        </ConnContext.Provider>
    )
}

export default Connector
