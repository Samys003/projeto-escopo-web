import MobileHeader from "../../components/MobileHeader.jsx";
import Title2 from "../../components/Typography/Title2.jsx";
import FormInput from "../../components/FormInput.jsx";
import ButtonText from "../../components/Typography/ButtonText.jsx";
import { Search } from "lucide-react";
import { useForm } from 'react-hook-form';
import { searchUserByEmail } from "../../services/api.js";

function ProjectCreator() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }


    async function handleAdicionarIntegrante() {
        //Caso o campo de email esteja vazio
        if (!email.trim()) return;

        try {
            setErro("");

            const response = await buscarUsuarioPorEmail(email);
            const usuario = response.body;

            // Busca uma correspondência do usuário encontrado na busca na lista de integrantes
            const usuarioNaLista = integrantes.some(
                integrante => integrante.id === usuario.id
            );
            // Se houve correspondência não adiciona a lista
            if (usuarioNaLista) {
                setErro("Usuário já adicionado");
                return;
            }

            const novoIntegrante = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                fotoPerfil: usuario.foto_perfil,
                nivelAcesso: 2 //Analista de requisitos
            };

            // Puxa a lista de integrantes, reatribui ela a si mesma e adiciona nosso novo integrante
            setIntegrantes(prev => [...prev, novoIntegrante]);

            // Limpando o campo do email
            setEmail("");
        } catch (error) {
            setErro("Usuário não encontrado");
        }
    }



    return (
        <div>
            <MobileHeader></MobileHeader>
            <div className="flex flex-col px-4 py-[10px] gap-3">
                <Title2>Novo Projeto</Title2>
                <FormInput labelContent="Titulo do Projeto" inputClassName="text-lg" placeholder="Novo Projeto"
                    register={register("titulo", { required: true })}></FormInput>
                <FormInput labelContent="Sobre o projeto" className="h-24" placeholder="Insira uma breve descrição sobre o projeto"
                    register={register("descricao", { required: true })}></FormInput>
                <FormInput labelContent="Integrantes" placeholder="Buscar por email" icon={<Search className="text-(--cinza-700)" />}
                    register={register("titulo", { required: true })}> <Search></Search> </FormInput>

                <button className="absolute bottom-5 right-5 py-2 px-5 bg-(--color-base) text-white font-semibold rounded-lg text-xl"
                    onClick={() => handleSubmit(onSubmit)()}>
                    Criar Projeto
                </button>
            </div>
        </div>

    )
}

export default ProjectCreator;