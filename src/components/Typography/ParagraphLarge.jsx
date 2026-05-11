function ParagraphLarge(props) {
    return (
        <p className={`text-[16px] font-inter ${props.className} font-regular`}>{props.children}</p>
    )
}

export default ParagraphLarge;