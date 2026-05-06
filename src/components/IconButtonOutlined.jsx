//TODO: Refatorar IconButton para incluir esse como uma variação
function IconButtonOutlined(props){
    return (
        <button onClick={props.onClick} className=" border-(--cinza-300) border-[1px] p-[0px] rounded-md">
        {props.icon}
        </button>
    )
}

export default IconButtonOutlined;