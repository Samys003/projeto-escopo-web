import ParagraphMedium from "../../../components/Typography/ParagraphMedium";
import Title2 from "../../../components/Typography/Title2";

function Register({ formatRegistros }) {
    console.log(formatRegistros)
    return (
        <div className=" flex flex-col gap-3 pt-1">{Object.entries(formatRegistros).map(([mes, registros]) => (
            <div key={mes.id}>
                <Title2>{mes.month}</Title2>
                {registros.map((registro) => (
                    <div key={registro.id}>
                        <ParagraphMedium>{registro.titulo}</ParagraphMedium>
                    </div>
                ))}
            </div>
        ))}
            {/* <div className="flex justify-center items-center">
                <Title2>2026</Title2>
            </div>
            <div className=" flex flex-col gap-1 border-(--cinza-300) border-b">

            </div>
            <div className="flex justify-between border border-(--cinza-300) p-7 rounded-xl">

                <ParagraphMedium>17/05/2026</ParagraphMedium>
            </div> */}
        </div>
    )
}

export default Register;