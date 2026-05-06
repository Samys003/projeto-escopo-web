
function IconButton(props) {
    return (
        <button onClick={props.onClick} className="bg-(--color-base) text-white p-2 rounded-md">
            {props.icon}
        </button>
    )
}

export default IconButton;