function Title3(props){
    return(
        <h3 className= {`text-xl font-inter ${props.className} font-semibold`}> {props.children}</h3>
    )
}

export default Title3;