function ParagraphMedium(props){
    return(
        <p className= {`text-[14px] font-inter ${props.className} font-regular`}> {props.children}</p>
    )
}

export default ParagraphMedium;