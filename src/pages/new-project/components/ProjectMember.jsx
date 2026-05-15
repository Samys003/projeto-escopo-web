import { X } from 'lucide-react';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';

function ProjectMember({ integrante, isOwner = false, onClose }) {
    return (
        <div>
            <div
                className={`
                flex bg-(--cinza-300) w-full px-1 py-2 rounded-lg justify-between items-center
                ${isOwner ? 'bg-(--cinza-300):' : 'bg-(--cinza-200'}
                `}
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"
                    alt=""
                    className="w-8 h-8 rounded-full"
                />
                <div>
                    <ParagraphMedium className="truncate">{integrante.nome}</ParagraphMedium>

                    {isOwner && (
                        <ParagraphMedium className="text-(--cinza-500)">
                            Proprietário(a)
                        </ParagraphMedium>
                    )}
                </div>
                <select
                    disabled={isOwner}
                    className={`
                    text-(--cinza-700) border border-(--cinza-400) rounded-xl px-1 py-2
                    
                ${isOwner ? 'opacity-50 cursor-not-allowed' : ''}}
                    `}
                >
                    <option value="1">Gerente de Projeto</option>
                    <option value="2">Analista de Requisitos</option>
                    <option value="3">Desenvolvedor</option>
                    <option value="4">Cliente</option>
                </select>
                <button
                    disabled={isOwner}
                    className={`${isOwner ? 'opacity-0' : ''}`}
                    onClick={onClose}
                >
                    <X
                        className={`
                        text-(--cinza-700)

                        ${isOwner ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    ></X>
                </button>
            </div>
        </div>
    );
}
export default ProjectMember;
