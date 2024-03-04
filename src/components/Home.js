import TableList from "./TableList"
import TopBar from "./TopBar"
import WorkSpace from "./WorkSpace"

window.workers = [
    { id: '001', name: '查询'}
]
function Home() {
    return (
        <div className="home">
            <TopBar/>
            <div className ="main-body">
                <TableList/>
                <WorkSpace/>
            </div>
        </div>
    )
}

export default Home
