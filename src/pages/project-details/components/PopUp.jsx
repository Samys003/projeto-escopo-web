import IconButton from '../../../components/IconButton';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import Title4 from '../../../components/Typography/Title4';
import { X } from 'lucide-react';

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
}) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="p-4 w-85.5 h-44 bg-white rounded-xl">
                <div className="w-full flex flex-col gap-1">
                    <div className="flex justify-between">
                        <Title4 className="text-center w-full text-(--cinza-700)">
                            {tituloNovo}
                        </Title4>
                        <button onClick={onClose} className="">
                            <X className="text-black" />
                        </button>
                    </div>
                    <div className=" w-full h-full pl-2 py-2 flex flex-col gap-1">
                        <ParagraphMedium className="text-(--cinza-700)">
                            {tituloCategoria}
                        </ParagraphMedium>
                        {showInput && (
                            <form>
                                <input
                                    type="text"
                                    className="border border-(--cinza-700) w-73.5 p-1 h-8 rounded-xl text-(--cinza-600)"
                                    placeholder={placeholder}
                                    value={value}
                                    onChange={onChange}
                                ></input>
                            </form>
                        )}
                    </div>

                    <div className="flex items-end justify-end py-2">
                        <IconButton>Cancelar</IconButton>
                        <IconButton onClick={onClick}>{children}</IconButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp;
