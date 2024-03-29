import { Tree } from "primereact/tree"
import { useEffect, useState } from "react"

const ipcRenderer = window.ipcRender

function TableList({tableSelect}) {
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
    const onselect = (event) => {
        const tableName = event.node.label
        tableSelect(tableName)
    }
    useEffect(() => {
        ipcRenderer.receive('tables', (event, message) => {
            setNodes(adapt(JSON.parse(message).data))
        })
    }, [])
    return (
        <div className="card flex justify-content-center left-side">
            <Tree filter filterMode="lenient" value={nodes} selectionMode="single" onSelect={onselect} emptyMessage = "No tables found" className="w-full md:w-30rem table-list"/>
        </div>
    )
}

export default TableList
