import React, { useState } from "react"
import MenuButton from "./MenuButton"
import { faLink, faSquarePlus, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons'
import Connector from "./Connector"
import { guid } from "../utils/guid"

function TopBar({addWorker}) {
    const [visible, setVisible] = useState(false)
    const menuList = [
        { 
            id: "001",
            name: "连接",
            icon: faLink,
            visible: visible,
            onClick: () => { setVisible(true) }
        },
        {
            id: "002",
            name: "新建查询",
            icon: faMagnifyingGlassPlus,
            onClick: () => {
                addWorker({
                    key: guid(),
                    label: ' 查询 ',
                    closable: true,
                    type: 'QUERY',
                    sql: '',
                    data: '',
                    message: '',
                    isLoading: false
                })
            }
        },
        {
            id: "003",
            name: "新建表",
            icon: faSquarePlus,
            onClick: () => {
                addWorker({
                    key: guid(),
                    label: ' 新建表 ',
                    type: 'CREATE'
                })
            }
        }
    ]
    const menuBottonList = menuList.map(it => {
        return <MenuButton key={it.id} menu={it} />
    })
    return (
        <div className="top-bar">
            { menuBottonList }
            <Connector visible={visible} onHidden= { () => setVisible(false)}/>
        </div>
    )
}

export default TopBar
