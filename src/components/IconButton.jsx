import ParagraphMedium from './Typography/ParagraphMedium';

function IconButton({ onClick, icon, children, className = '', textClassName = '' }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center bg-(--color-base) text-white p-2 rounded-md ${className} `}
        >
            {icon}
            <ParagraphMedium className={`font-medium ${textClassName}`}>{children}</ParagraphMedium>
        </button>
    );
}

export default IconButton;
