//TODO: Refatorar IconButton para incluir esse como uma variação
function IconButtonOutlined({ icon, onClick }) {
    return (
        <button onClick={onClick} className=" border-(--cinza-300) border p-0 rounded-md">
            {icon}
        </button>
    );
}

export default IconButtonOutlined;
