function ParagraphMedium({ as: Component = 'p', className = '', children, ...props }) {
    return (
        <Component className={`text-[14px] font-inter ${className} font-regular`} {...props}>
            {children}
        </Component>
    );
}

export default ParagraphMedium;
