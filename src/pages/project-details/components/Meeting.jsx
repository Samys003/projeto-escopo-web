import ParagraphMedium from "../../../components/Typography/ParagraphMedium";
import Title2 from "../../../components/Typography/Title2";

function Meeting({ formatReunioes }) {
    return (
        <div>
            {Object.entries(formatReunioes).map(([ano, meses]) => (
                <div>
                    <div key={ano} className="flex items-center justify-center gap-2">
                        <Title2>{ano}</Title2>
                    </div>
                    {Object.entries(meses).map(([mes, reunioes]) => (
                        <div className="flex flex-col gap-2 mb-2 ">
                            <div key={mes} className="flex border-b border-(--cinza-300) pb-1">
                                <Title2 className="text-(--color-base)">{mes}</Title2>
                            </div>
                            {reunioes.map((reuniao) => (
                                <div className="flex border border-(--cinza-300) justify-between rounded-xl p-3 mb-3">
                                    <div key={reuniao} className="">
                                        <ParagraphMedium>{reuniao.titulo}</ParagraphMedium>
                                        <div className="flex -space-x-4">
                                            {reuniao.foto_usuarios.map((foto, index) => (

                                                <img
                                                    key={index}
                                                    src={foto} alt="usuario"
                                                    className="w-10 rounded-full"
                                                >
                                                </img>

                                            ))}
                                        </div>
                                    </div>

                                    <ParagraphMedium>{new Date(reuniao.criado_em).toLocaleDateString("pt-BR")}</ParagraphMedium>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )

}


export default Meeting;