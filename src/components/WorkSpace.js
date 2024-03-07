import QueryWork from "./QueryWorker"
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
                            workers.map(worker => { return activeKey === worker.key && <QueryWork key={worker.key} worker={worker} updateWorker={updateWorker}/>})
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


