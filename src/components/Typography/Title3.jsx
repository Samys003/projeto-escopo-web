function Title3(props) {
    return <h3 className={`text-xl font-inter  ${props.className}`}> {props.children}</h3>;
}

export default Title3;

// revisar uso do title 3, pois foi removido o "font-medium"
