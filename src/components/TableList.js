import { Tree } from "primereact/tree"
import { useEffect, useState } from "react"
const  ipcRenderer = window.ipcRender

function TableList() {
    const[nodes, setNodes] = useState([])
    const adapt = (data) => {
        const list = []
        for (let i = 0; i < data.length; i++) {
            list.push({
                key: i,
                label: data[i].table_name,
                icon: 'pi pi-fw pi-table'
            })
        }
        return list
    }
    useEffect(() => {
        ipcRenderer.receive('tables', (event, message) => {
            setNodes(adapt(JSON.parse(message).data))
        })
    }, [])
    return (
        <div className="card flex justify-content-center left-side">
            <Tree filter filterMode="lenient" value={nodes} className="w-full md:w-30rem table-list"/>
        </div>
    )
}

export default TableList
