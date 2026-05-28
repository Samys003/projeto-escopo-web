function ParagraphSmall({ as: Component = 'p', className = '', children, ...props }) {
    return (
        <Component className={`text-[12px] font-inter ${className} font-regular`} {...props}>
            {children}
        </Component>
    );
}

export default ParagraphSmall;
