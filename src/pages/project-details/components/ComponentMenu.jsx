import ParagraphMedium from "../../../components/Typography/ParagraphMedium";


function ComponentMenu({ tabs, currentTab, setCurrentTab }) {

    return (
        <div className=" flex items-center justify-between">
            {tabs.map((tab) => (
                <button key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`pl-3 pr-3 pb-1 pt-1 rounded-[18px] ${currentTab === tab ? "bg-(--roxo-light) text-(--roxo-dark)" : "bg-(--cinza-200) text-(--cinza-700)"}`}>
                    <ParagraphMedium>{tab}</ParagraphMedium>
                </button>
            ))}

        </div>
    )
}



export default ComponentMenu;