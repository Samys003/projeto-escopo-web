import MobileHeader from "../../components/MobileHeader.jsx";
import Title2 from "../../components/Typography/Title2.jsx";
import FormInput from "../../components/FormInput.jsx";

function ProjectCreator() {


    return (
        <div>
            <MobileHeader></MobileHeader>
            <div className="flex flex-col px-4 py-[10px] gap-3">
                <Title2>Novo Projeto</Title2>
                <FormInput labelContent = "Titulo do Projeto" inputClassName="text-lg" placeholder = "Novo Projeto"></FormInput>
                <FormInput labelContent = "Sobre o projeto" placeholder = "Insira uma breve descrição sobre o projeto" className = "h-24"></FormInput>
                <FormInput labelContent = "Integrantes" placeholder = "Buscar por email" icon={<Search  className ="text-(--cinza-700)"/>}> <Search></Search></FormInput>

            </div>
        </div>

    )
}

export default ProjectCreator;