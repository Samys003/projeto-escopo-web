function Title2(props) {
    return (
        <h2 className={`text-2xl font-inter font-semibold ${props.className}`}>
            {' '}
            {props.children}
        </h2>
    );
}

export default Title2;
