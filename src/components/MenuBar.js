import { Button } from "primereact/button"

function MenuBar({menuItems}) {

    const menuButtons = menuItems.map(menu => {
        return <Button key={menu.id} label={menu.label} severity="success" icon={menu.icon} iconPos="left" text size="small" unstyled className="menu-bar-button" onClick={menu.click}/>
    })

    return (<div className="menu-bar">{menuButtons}</div>)
}

export default MenuBar
