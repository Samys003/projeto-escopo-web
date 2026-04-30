function Title2(props){
    return(
        <h2 className= {`text-2xl font-inter ${props.className} font-semibold`}> {props.children}</h2>
    )
}

export default Title2;