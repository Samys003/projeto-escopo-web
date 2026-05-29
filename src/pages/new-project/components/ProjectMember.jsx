import { X } from 'lucide-react';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';

function ProjectMember({
    integrante,
    isOwner = false,
    adicional = false,
    pendente = false,
    onClose,
    onNivelAcessoChange,
}) {
    return (
        <div>
            <div
                className={`
                border-
                flex bg-(--cinza-200) w-full px-1 py-2 rounded-lg justify-between items-center
                lg:px-2
                ${isOwner & 'bg-(--cinza-300)'}
                ${pendente && 'opacity-75'}
                ${adicional && 'bg-(--roxo-light) border-(--color-variant) border-2 border-(--color-variant)'}
                `}
            >
                <div
                    className="flex items-center
                lg:gap-3"
                >
                    <img
                        // TODO: Incluir a verificação de integrante.foto e subsituir pela do assets se estiver vazia
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <ParagraphMedium
                            className={`truncate text-(--cinza-700)
                            ${pendente && 'text-(--cinza-500)'}
                            ${adicional && 'text-(--color-dark)'}`}
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
                </div>
                <div className="flex">
                    <select
                        disabled={isOwner}
                        defaultValue={integrante.nivel_acesso_id || 4}
                        className={`
                        text-(--cinza-700) border border-(--cinza-400) rounded-xl px-1 py-2
                        ${isOwner && 'opacity-50 cursor-not-allowed'}
                        ${adicional && 'border-(--color-variant)'} 
                        `}
                        // TODO: Revisar o color-variant, provavelmente inserir uma nova cor
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
