function Title2(props){
    return(
        <h3 className= {`text-5 font-inter ${props.className} font-semibold`}> {props.children}</h3>
    )
}

export default Title2;