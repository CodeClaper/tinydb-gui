import TableList from "./TableList"
import TopBar from "./TopBar"
import WorkSpace from "./WorkSpace"

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
