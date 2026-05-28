function ParagraphLarge({ as: Component = 'p', className = '', children, ...props }) {
    return (
        <Component className={`text-[16px] font-inter ${className} font-regular`} {...props}>
            {children}
        </Component>
    );
}

export default ParagraphLarge;
