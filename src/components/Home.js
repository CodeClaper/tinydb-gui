import { useState } from "react"
import Message from "./Message"
import TableList from "./TableList"
import TopBar from "./TopBar"
import WorkSpace from "./WorkSpace"
import { guid } from "../utils/guid"


function Home() {
    const [activeKey, setActiveKey] = useState('')
    const [workers, setWorkers] = useState([])

    /* Add a worker, may be QueryWorker or CreateTableWorker. */
    const addWorker = (worker) => {
        setWorkers([...workers, worker])
        setActiveKey(worker.key)
    }

    /* Remove the worker. */
    const removeWorker = (targetKey) => {
        const targetIndex = workers.findIndex((pane) => pane.key === targetKey)
        const newWorkers = workers.filter((it) => it.key !== targetKey)
        if (newWorkers.length && targetKey === activeKey) {
            const { key } = newWorkers[targetIndex === newWorkers.length ? targetIndex - 1 : targetIndex]
            setActiveKey(key)
        }
        setWorkers(newWorkers)
    }

    /* Update the worker. */
    const updateWorker = (worker) => {
        debugger
        const newWorkers = workers.map(it => {
            if (it.key === worker.key)
                return worker
            else
                return it
        })
        console.log(newWorkers.length)
        setWorkers(newWorkers)
    }

    /* When table selection trigger a QueryWorker, 
     * if already exist, set it active.*/
    const tableSelect = (tableName) => {
        const found = workers.find((element) => element.type === 'SELECTION' && element.label === tableName)
        if (found) {
            setActiveKey(found.key)
        } else {
            const sql = 'select * from ' + tableName
            addWorker({
                key: guid(),
                label: tableName,
                type: 'SELECTION',
                sql: sql,
                data: '',
                message: '',
                isLoading: false,
                trigger: true
            })
        }
    }

    /* Change active key. */
    const onChange = (key) => {
        setActiveKey(key)
    }
    return (
        <>
            <div className="home">
                <TopBar addWorker = {addWorker}/>
                <div className ="main-body">
                    <TableList tableSelect={tableSelect}/>
                    <WorkSpace activeKey={activeKey}  workers={workers} removeWorker={removeWorker} onChange={onChange} updateWorker={updateWorker}/>
                </div>
            </div>
            <Message/>
        </>
    )
}

export default Home
