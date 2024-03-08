import QueryWork from "./QueryWorker"
import CreateTableWorker from "./CreateTableWorker"
import { Tabs, Empty } from 'antd'

function WorkSpace({activeKey, workers, onChange, removeWorker, updateWorker}) {
    const onEdit = (targetKey, action) => {
        console.log(action, targetKey)
        if (action === 'remove') 
            removeWorker(targetKey)
    }
    return (
        <div className="work-space">
            {
                workers.length > 0 && (
                    <>
                        <Tabs
                            hideAdd
                            onChange={onChange}
                            activeKey={activeKey}
                            type="editable-card"
                            onEdit={onEdit}
                            items={workers}
                        />
                        {
                            workers.map(worker => { return activeKey === worker.key 
                                && ((worker.type === 'QUERY' || worker.type === 'SELECTION') && <QueryWork key={worker.key} worker={worker} updateWorker={updateWorker}/> || worker.type === 'CREATE' && <CreateTableWorker/>)})
                        }
                    </>
                )
            }
            {
                workers.length == 0 && (<div className="center full"><Empty description={false}/></div>)
            }
        </div>
    )
}

export default WorkSpace


