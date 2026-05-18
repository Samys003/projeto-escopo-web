function ParagraphSmall(props) {
    return (
        <p className={`text-[12px] font-inter ${props.className} font-regular`}>
            {' '}
            {props.children}
        </p>
    );
}

export default ParagraphSmall;
