import ParagraphSmall from '../../../components/Typography/ParagraphSmall';

function ButtonRegistrer({ children, onClick }) {
    return (
        <div>
            <button
                className={`border border-(--cinza-300) bg-(--cinza-100) text-(--cinza-500) w-30 h-7.5 flex items-center justify-center rounded-xl `}
                onClick={onClick}
            >
                <ParagraphSmall>{children}</ParagraphSmall>
            </button>
        </div>
    );
}

export default ButtonRegistrer;
