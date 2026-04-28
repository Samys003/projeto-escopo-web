import DocumentQuickAccess from "./DocumentQuickAccess"

function ProjectListHorizontal(){
    return(
        <div className="overflow-x-auto border-b border-(--cinza-500) pb-3">
            <div className="flex gap-[10px] w-max">
                <DocumentQuickAccess></DocumentQuickAccess>
                <DocumentQuickAccess></DocumentQuickAccess>
                <DocumentQuickAccess></DocumentQuickAccess>
                <DocumentQuickAccess></DocumentQuickAccess>
                <DocumentQuickAccess></DocumentQuickAccess>
            </div>
        </div>
    )
}

export default ProjectListHorizontal