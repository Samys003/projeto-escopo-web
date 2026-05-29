import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

function Alert({ message, onClose, positionClass, duration = 4000 }) {
    const [visible, setVisible] = useState(true);
    const [width, setWidth] = useState('100%');

    useEffect(() => {
        // inicia animação da barra
        const start = setTimeout(() => {
            setWidth('0%');
        }, 50);

        // fecha sozinho
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(start);
        };
    }, []);

    function handleClose() {
        setVisible(false);

        // espera animação de saída terminar
        setTimeout(() => {
            onClose?.();
        }, 300);
    }

    if (!visible) return null;

    return (
        <div
            className={`
                fixed left-6 right-6 z-50 overflow-hidden rounded-2xl shadow-lg
                lg:w-[50vw] bg-(--color-vermelho)
                transition-all duration-300
                ${positionClass}
            `}
        >
            <div className="flex items-center gap-3 px-4 py-4">
                <p className={`flex-1 font-inter-medium text-white`}>{message}</p>

                {!!onClose && (
                    <button onClick={handleClose} className="cursor-pointer" type="button">
                        <X className="text-white"></X>
                    </button>
                )}
            </div>

            <div
                className="h-1 bg-white/80 transition-all ease-linear"
                style={{
                    width,
                    transitionDuration: `${duration}ms`,
                }}
            />
        </div>
    );
}

export default Alert;
