import MobileHeader from "../../components/MobileHeader.jsx";
import Title2 from "../../components/Typography/Title2.jsx";
import FormInput from "../../components/FormInput.jsx";

function ProjectCreator() {
    return (
        <div>
            <MobileHeader></MobileHeader>
            <div className="flex flex-col px-4 py-[10px] gap-3">
                <Title2>Novo Projeto</Title2>
                <FormInput label = "Titulo do Projeto" placeholder = "Novo Projeto"></FormInput>

            </div>
        </div>

    )
}

export default ProjectCreator;