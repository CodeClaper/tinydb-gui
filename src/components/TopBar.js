import React, { useState } from "react"
import MenuButton from "./MenuButton"
import { faLink, faTable } from '@fortawesome/free-solid-svg-icons'
import Connector from "./Connector"

function TopBar() {
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
            icon: faTable,
            onClick: () => {}
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