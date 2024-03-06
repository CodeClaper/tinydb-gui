import { useState } from "react"
import Message from "./Message"
import TableList from "./TableList"
import TopBar from "./TopBar"
import WorkSpace from "./WorkSpace"

function Home() {
    const [workerList, setWorkerList] = useState([])
    const addWorker = (worker) => {
        setWorkerList([
            ...workerList,
            worker
        ])
    }
    return (
        <>
        <div className="home">
            <TopBar addWork = {addWorker}/>
            <div className ="main-body">
                <TableList/>
                <WorkSpace/>
            </div>
        </div>
        <Message/>
        </>
    )
}

export default Home
