import { Button } from 'antd'

function MenuBar({menuItems}) {

    const menuButtons = menuItems.map(menu => {
        return <Button key={menu.id} type="default" icon={menu.icon} onClick={menu.click}>{menu.label}</Button>
    })

    return (<div className="menu-bar">{menuButtons}</div>)
}

export default MenuBar
