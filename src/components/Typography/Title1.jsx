function Title1({ as: Component = 'h1', className = '', children, ...props }) {
    return (
        <Component className={`text-8 font-inter ${className} font-bold`} {...props}>
            {children}
        </Component>
    );
}

export default Title1;
