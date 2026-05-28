function Title2({ as: Component = 'h2', className = '', children, ...props }) {
    return (
        <Component className={`text-2xl font-inter ${className} font-semibold`} {...props}>
            {children}
        </Component>
    );
}

export default Title2;
