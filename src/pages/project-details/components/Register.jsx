import { ChevronDown, ChevronRight } from 'lucide-react';
import IconButton from '../../../components/IconButton';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import Title2 from '../../../components/Typography/Title2';
import { useNavigate } from 'react-router-dom';

function Register({ formatRegistros, expandRegsister, setExpandRegister }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2  lg:pl-3 lg:pr-3">
            {Object.entries(formatRegistros).map(([ano, meses]) => (
                <div key={ano}>
                    <div className="flex items-center justify-center gap-2">
                        <Title2>{ano}</Title2>
                    </div>

                    {Object.entries(meses).map(([mes, registros]) => (
                        <div key={mes} className="flex flex-col gap-4 mb-2 ">
                            <div className="flex border-b items-center  border-(--cinza-300) pb-1 ">
                                <Title2 className="text-(--color-base)">{mes}</Title2>
                                <IconButton
                                    onClick={() =>
                                        setExpandRegister((prev) => ({
                                            ...prev,
                                            [mes]: !prev[mes],
                                        }))
                                    }
                                    icon={
                                        expandRegsister[mes] === false ? (
                                            <ChevronRight className="text-(--color-base)" />
                                        ) : (
                                            <ChevronDown className="text-(--color-base)" />
                                        )
                                    }
                                    className="bg-transparent cursor-pointer"
                                ></IconButton>
                            </div>
                            {expandRegsister[mes] !== false &&
                                registros.map((registro) => (
                                    <button
                                        onClick={() => navigate(`/registro/${registro.id}`)}
                                        key={registro.id}
                                        className="flex border hover:bg-(--roxo-light) border-(--cinza-300) justify-between rounded-xl p-6 cursor-pointer"
                                    >
                                        <ParagraphMedium className="w-[33%] flex  justify-start truncate">
                                            {registro.titulo}
                                        </ParagraphMedium>
                                        <ParagraphMedium className="hidden w-[33%]  lg:block text-(--cinza-600) truncate">
                                            {registro.conteudo}
                                        </ParagraphMedium>
                                        <ParagraphMedium className=" text-end   text-(--cinza-600)">
                                            {new Date(registro.criado_em).toLocaleDateString(
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

export default Register;
