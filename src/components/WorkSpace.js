import QueryWork from "./QueryWorker"
import { Tabs } from 'antd'
import { useState } from "react"

function WorkSpace() {
    const [activeKey, setActiveKey] = useState('')
    const [items, setItems] = useState([])
    const onChange = (key) => {
        setActiveKey(key)
    }
    const add = () => {
        setItems([...items, {}])
    }
    const remove = (targetKey) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey)
        const newPanes = items.filter((it) => it.key !== targetKey)
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex]
            setActiveKey(key)
        }
        setItems(newPanes)
    }
    const onEdit = (targetKey, action) => {
        if (action === 'add')
            add()
        else
            remove(targetKey)
    }
    return (
        <div className="work-space">
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
            />
            <QueryWork/>
        </div>
    )
}

export default WorkSpace


