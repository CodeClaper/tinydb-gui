import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const classNames = require('classnames')

export default function MenuButton({menu}) {
    const btnClass = classNames({
        'menu-button': true,
        'center': true
    })
    return (
        <div className={btnClass} onClick={ menu.onClick }>
            <FontAwesomeIcon icon={menu.icon} size="3x" style={{color: "#74C0FC",}} />
            { menu.name }
        </div>
    )
}
