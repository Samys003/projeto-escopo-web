import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import Title2 from '../../../components/Typography/Title2';
import user_default from '../../../../src/pages/project-details/assets/user_default.svg';
import { useNavigate } from 'react-router-dom';

function Meeting({ formatReunioes }) {
    const navigate = useNavigate();

    return (
        <div>
            {Object.entries(formatReunioes).map(([ano, meses]) => (
                <div key={ano}>
                    <div className="flex items-center justify-center gap-2">
                        <Title2>{ano}</Title2>
                    </div>
                    {Object.entries(meses).map(([mes, reunioes]) => (
                        <div key={mes} className="flex flex-col gap-2 mb-2 ">
                            <div className="flex border-b border-(--cinza-300) pb-1">
                                <Title2 className="text-(--color-base)">{mes}</Title2>
                            </div>
                            {reunioes.map((reuniao) => (
                                <button
                                    key={reuniao.id}
                                    onClick={() => navigate(`/reuniao/${reuniao.id}`)}
                                    className="flex border border-(--cinza-300) justify-between rounded-xl p-3 mb-3"
                                >
                                    <div className="">
                                        <ParagraphMedium>{reuniao.titulo}</ParagraphMedium>
                                        <div className="flex -space-x-4">
                                            {reuniao.foto_usuarios.map((foto) => {
                                                return (
                                                    <img
                                                        key={foto}
                                                        className="w-10 rounded-full"
                                                        src={foto || user_default}
                                                    ></img>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <ParagraphMedium>
                                        {new Date(reuniao.criado_em).toLocaleDateString('pt-BR')}
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
