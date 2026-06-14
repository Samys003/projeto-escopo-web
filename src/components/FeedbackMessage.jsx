function FeedbackMessage({ type = 'error', children, className = '' }) {
    if (!children) {
        return null;
    }

    const styles =
        type === 'success'
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700';

    return (
        <div className={`rounded-lg border px-4 py-3 ${styles} ${className}`} role="alert">
            <p className="text-sm leading-5">{children}</p>
        </div>
    );
}

export default FeedbackMessage;
