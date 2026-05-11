import ParagraphSmall from "../../../components/Typography/ParagraphSmall"

function ButtonRegistrer({ children }) {
    return (
        <div>
            <button>
                <ParagraphSmall className="border border-(--cinza-300) bg-(--cinza-100) text-(--cinza-500) w-30 h-7.5 flex items-center justify-center rounded-xl">{children}</ParagraphSmall>
            </button>
        </div>
    )
}

export default ButtonRegistrer;