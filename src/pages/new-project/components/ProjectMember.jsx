import { X } from 'lucide-react';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';

function ProjectMember({
    integrante,
    isOwner = false,
    onClose,
    onNivelAcessoChange,
    pendente = false,
}) {
    return (
        <div>
            <div
                className={`
                flex bg-(--cinza-300) w-full px-1 py-2 rounded-lg justify-between items-center
                lg:px-2
                ${isOwner ? 'bg-(--cinza-300)' : 'bg-(--cinza-200'}
                ${pendente && 'opacity-75'}
                `}
            >
                <img
                    // TODO: Substituir imagem pela imagem do assets
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"
                    alt=""
                    className="w-8 h-8 rounded-full"
                />
                <div>
                    <ParagraphMedium
                        className={`truncate
                    ${pendente ? 'text-(--cinza-500)' : 'text-(--cinza-700)'}`}
                    >
                        {integrante.nome}
                    </ParagraphMedium>

                    {isOwner && (
                        <ParagraphMedium className="text-(--cinza-500)">
                            Proprietário(a)
                        </ParagraphMedium>
                    )}
                    {pendente && (
                        <ParagraphMedium className="text-(--cinza-800)">
                            (Convite pendente)
                        </ParagraphMedium>
                    )}
                </div>
                <div className="flex">
                    <select
                        disabled={isOwner}
                        className={`
                        text-(--cinza-700) border border-(--cinza-400) rounded-xl px-1 py-2
                        ${isOwner ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onChange={(e) => onNivelAcessoChange(integrante.id, e.target.value)}
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
        </div>
    );
}
export default ProjectMember;
