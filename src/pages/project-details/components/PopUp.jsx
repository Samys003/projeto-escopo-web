import IconButton from '../../../components/IconButton';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import Title4 from '../../../components/Typography/Title4';
import { X } from 'lucide-react';
import ParagraphSmall from '../../../components/Typography/ParagraphSmall';
import { useEffect } from 'react';

function PopUp({
    onClose,
    value,
    onChange,
    onClick,
    tituloNovo,
    tituloCategoria,
    placeholder,
    showInput = true,
    children = '',
    erro,
}) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className=" p-4 bg-white  rounded-xl">
                <div className="w-full flex flex-col gap-1">
                    <div className="flex justify-between">
                        <Title4 className="text-center w-full text-(--cinza-700)">
                            {tituloNovo}
                        </Title4>

                        <button onClick={onClose} className="cursor-pointer">
                            <X className="text-black hover:text-(--roxo-dark) cursor-pointer" />
                        </button>
                    </div>
                    <div className=" w-full h-full pl-2 py-2 justify-center items-center flex flex-col gap-1">
                        {erro && (
                            <div className="bg-red-100 p-2 rounded-[10px] flex w-full items-center justify-center">
                                <ParagraphSmall className="text-red-800">{erro}</ParagraphSmall>
                            </div>
                        )}
                        <ParagraphMedium className="text-(--cinza-700)  w-90">
                            {tituloCategoria}
                        </ParagraphMedium>
                        {showInput && (
                            <form>
                                <input
                                    type="text"
                                    className="border border-(--cinza-700) w-90 p-1 h-8 rounded-xl text-(--cinza-600)"
                                    placeholder={placeholder}
                                    value={value}
                                    onChange={onChange}
                                ></input>
                            </form>
                        )}
                    </div>

                    <div className="flex justify-end items-end gap-3 ">
                        <IconButton
                            className="hover:bg-(--color-dark) cursor-pointer"
                            onClick={onClose}
                        >
                            Cancelar
                        </IconButton>
                        <IconButton
                            className="hover:bg-(--color-dark) cursor-pointer"
                            onClick={onClick}
                        >
                            {children}
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
