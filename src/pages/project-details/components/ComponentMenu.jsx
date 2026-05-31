import ParagraphMedium from '../../../components/Typography/ParagraphMedium';

function ComponentMenu({ tabs, currentTab, setCurrentTab }) {
    return (
        <div className=" flex items-center justify-between lg:justify-start lg:gap-5">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`pl-3 pr-3 pb-1 pt-1 rounded-[18px] lg:p-1 lg:pl-2 lg:pr-3 lg:min-w-30 lg:items-center justify-center ${currentTab === tab ? 'bg-(--roxo-light) text-(--roxo-dark)' : 'bg-(--cinza-200) text-(--cinza-700)'}`}
                >
                    <ParagraphMedium>{tab}</ParagraphMedium>
                </button>
            ))}
        </div>
    );
}

export default ComponentMenu;
