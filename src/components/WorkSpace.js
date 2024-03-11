import QueryWork from "./QueryWorker"
import CreateTableWorker from "./CreateTableWorker"
import { Tabs, Empty } from 'antd'

function WorkSpace({activeKey, workers, onChange, removeWorker, updateWorker}) {
    const onEdit = (targetKey, action) => {
        if (action === 'remove') 
            removeWorker(targetKey)
    }
    const workerPanels = workers.map(worker=> {
        switch(worker.type) {
            case 'QUERY':
            case 'SELECTION':
                return activeKey === worker.key && (<QueryWork key={worker.key} worker={worker} updateWorker={updateWorker} />)
            case 'CREATE':
                return activeKey === worker.key && (<CreateTableWorker key={worker.key}/>)
                
        }
    })
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
                        { workerPanels }
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


