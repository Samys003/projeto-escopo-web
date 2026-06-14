import Title4 from '../../../components/Typography/Title4';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import IconButton from '../../../components/IconButton';
import { X, Mic } from 'lucide-react';

function PopUpTranscicao({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <Title4 className="text-(--cinza-700)">Transcrição da Reunião</Title4>

                    <IconButton
                        onClick={onClose}
                        className="bg-transparent hover:bg-(--roxo-light)"
                        icon={<X className="text-black hover:text-(--roxo-dark) w-5 h-5" />}
                    />
                </div>

                <div className="flex flex-col items-center text-center gap-4 py-4">
                    <ParagraphMedium className="text-(--cinza-700)">
                        Esta funcionalidade está em desenvolvimento.
                    </ParagraphMedium>

                    <ParagraphMedium className="text-(--cinza-400) italic">
                        Em breve disponível
                    </ParagraphMedium>
                </div>

                <div className="flex justify-center mt-2">
                    <IconButton onClick={onClose} className="hover:bg-(--color-dark)">
                        Entendi
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

export default PopUpTranscicao;
