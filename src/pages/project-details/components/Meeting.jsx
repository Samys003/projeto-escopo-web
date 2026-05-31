import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import Title2 from '../../../components/Typography/Title2';
import user_default from '../../../../src/pages/project-details/assets/user_default.svg';
import { useNavigate } from 'react-router-dom';
import IconButton from '../../../components/IconButton';
import { ChevronRight, ChevronDown } from 'lucide-react';

function Meeting({ formatReunioes, expandReuniao, setExpandReuniao }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2 lg:pl-3 lg:pr-3">
            {Object.entries(formatReunioes).map(([ano, meses]) => (
                <div key={ano}>
                    <div className="flex items-center justify-center gap-2">
                        <Title2>{ano}</Title2>
                    </div>

                    {Object.entries(meses).map(([mes, reunioes]) => (
                        <div key={mes} className="flex flex-col gap-3 mb-2 ">
                            <div className="flex items-center border-b border-(--cinza-300) pb-1">
                                <Title2 className="text-(--color-base)">{mes}</Title2>
                                <IconButton
                                    onClick={() =>
                                        setExpandReuniao((prev) => ({
                                            ...prev,
                                            [mes]: !prev[mes],
                                        }))
                                    }
                                    icon={
                                        expandReuniao[mes] === false ? (
                                            <ChevronRight className="text-(--color-base)" />
                                        ) : (
                                            <ChevronDown className="text-(--color-base)" />
                                        )
                                    }
                                    className="bg-transparent "
                                ></IconButton>
                            </div>
                            {expandReuniao[mes] !== false &&
                                reunioes.map((reuniao) => (
                                    <button
                                        key={reuniao.id}
                                        onClick={() => navigate(`/reuniao/${reuniao.id}`)}
                                        className="flex border border-(--cinza-300) justify-between rounded-xl p-3 mb-3"
                                    >
                                        <div className="lg:flex lg:gap-2 lg:items-center lg:justify-between  lg:w-[70%]">
                                            <ParagraphMedium className="truncate ">
                                                {reuniao.titulo}
                                            </ParagraphMedium>
                                            <div className="flex -space-x-4 ">
                                                {reuniao.foto_usuarios
                                                    .slice(0.4)
                                                    .map((foto, index) => {
                                                        return (
                                                            <img
                                                                key={index}
                                                                className="w-10 rounded-full"
                                                                src={foto || user_default}
                                                            ></img>
                                                        );
                                                    })}
                                            </div>
                                        </div>

                                        <ParagraphMedium className="lg:w-full lg:flex lg:justify-end lg:items-center  ">
                                            {new Date(reuniao.criado_em).toLocaleDateString(
                                                'pt-BR',
                                            )}
                                        </ParagraphMedium>
                                    </button>
                                ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Meeting;
