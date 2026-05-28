function Title4({ as: Component = 'h4', className = '', children, ...props }) {
    return (
        <Component className={`text-4 font-inter ${className} font-medium`} {...props}>
            {children}
        </Component>
    );
}

export default Title4;
