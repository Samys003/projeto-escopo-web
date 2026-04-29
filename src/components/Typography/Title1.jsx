function Title2(props){
    return(
        <h1 className= {`text-8 font-inter ${props.className} font-bold`}> {props.children}</h1>
    )
}

export default Title2;