import ParagraphMedium from "../../../components/Typography/ParagraphMedium";
import Title2 from "../../../components/Typography/Title2";

function Register({ formatRegistros }) {

    return (
        <div className="flex flex-col gap-2">

            {Object.entries(formatRegistros).map(([ano, meses]) => (
                <div>
                    <div key={ano} className="flex items-center justify-center gap-2">
                        <Title2>{ano}</Title2>
                    </div>
                    {Object.entries(meses).map(([mes, registros]) => (
                        <div className="flex flex-col gap-4 mb-2 ">
                            <div key={mes} className="flex border-b border-(--cinza-300) pb-1 ">
                                <Title2 className="text-(--color-base)">{mes}</Title2>
                            </div>
                            {registros.map((registro) => (
                                <div key={registro.id} className="flex border border-(--cinza-300) justify-between rounded-xl p-6">
                                    <ParagraphMedium>{registro.titulo}</ParagraphMedium>
                                    <ParagraphMedium>{new Date(registro.criado_em).toLocaleDateString("pt-BR")}</ParagraphMedium>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}

        </div>
    )
}

export default Register;