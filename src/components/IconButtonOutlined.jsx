//TODO: Refatorar IconButton para incluir esse como uma variação
function IconButtonOutlined(props) {
    return (
        <button onClick={props.onClick} className=" border-(--cinza-300) border p-0 rounded-md">
            {props.icon}
        </button>
    );
}

export default IconButtonOutlined;
