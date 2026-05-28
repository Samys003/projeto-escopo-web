function Title3({ as: Component = 'h3', className = '', children, ...props }) {
    return (
        <Component className={`text-xl font-inter ${className} font-medium`} {...props}>
            {children}
        </Component>
    );
}

export default Title3;
