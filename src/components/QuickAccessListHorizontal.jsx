import DocumentQuickAccess from "./DocumentQuickAccess"

function QuickAccessListHorizontal(props){
    const documentos = props.documentos

    return(
        <div className="overflow-x-auto border-b border-(--cinza-500) pb-3">
            <div className="flex gap-[10px] w-max">
                {documentos.map((documento) =>(
                    <DocumentQuickAccess documento = {documento}></DocumentQuickAccess>
                ))}
            </div>
        </div>
    )
}

export default QuickAccessListHorizontal