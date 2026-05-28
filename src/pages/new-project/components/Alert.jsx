function Alert({ message, onClose, positionClass, current, width }) {
    const CurrentIcon = current.icon;

    return (
        <div
            className={`
        absolute left-6 right-6 z-50 overflow-hidden rounded-2xl shadow-lg
        ${positionClass} ${current.container}
      `}
        >
            <div className="flex items-center gap-3 px-4 py-4">
                <CurrentIcon color="white" />

                <p className={`flex-1 font-inter-medium ${current.text}`}>{message}</p>

                {!!onClose && (
                    <button onClick={onClose} className="cursor-pointer" type="button">
                        <span className={`ml-4 text-lg ${current.text}`}>✕</span>
                    </button>
                )}
            </div>

            <div style={{ width }} className="h-1 bg-white/80 transition-all" />
        </div>
    );
}

export default Alert;
