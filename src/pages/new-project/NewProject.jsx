import MobileHeader from '../../components/MobileHeader.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import FormInput from '../../components/FormInput.jsx';
import ButtonText from '../../components/Typography/ButtonText.jsx';
import { Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { getUserByEmail } from '../../services/api.js';
import Title4 from '../../components/Typography/Title4.jsx';
import ParagraphMedium from '../../components/Typography/ParagraphMedium.jsx';
import ProjectMember from './components/ProjectMember.jsx';
import { useEffect, useState } from 'react';
// import { createProject } from '../../services/api.js';
import { createProject } from './services/new-project-endpoints';

function NewProject() {
    const [integrantes, setIntegrantes] = useState([]);
    const [erro, setErro] = useState('');

    //Puxando o usuario como proprietário do projeto
    useEffect(() => {
        const usuarioStorage = JSON.parse(localStorage.getItem('authUser'));

        if (!usuarioStorage?.email) {
            return;
        }
        //Adicionando o primeiro usuario, o criador do projeto a lista
        handleAdicionarIntegrante(usuarioStorage.email);
    }, []);

    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const idsIntegrantes = integrantes.map((integrante) => ({
            id: integrante.id,
            nivel_acesso_id: integrante.nivelAcesso,
        }));
        const payload = {
            titulo: data.titulo,
            descricao: data.descricao,
            integrantes: idsIntegrantes,
        };
        console.log(payload);
        const response = await createProject(payload);

        //TODO: Está faltando response para o create, criar tratativa para cada cenário
        alert('Projeto criado com sucesso!');
    };

    function onRemoveIntegrante(integranteId) {
        const newIntegrantes = integrantes.filter((integrante) => integrante.id != integranteId);
        setIntegrantes(newIntegrantes);
    }

    //Por padrão ele vai executar recebendo o valor do emailBusca, é a execução inicial com o email do autor do projeto
    async function handleAdicionarIntegrante(emailBusca) {
        var isOwner = true;
        //Quando for uma busca de email inserido o emailBusca vai estar vazio, então
        if (!emailBusca) {
            emailBusca = getValues('email');
            isOwner = false;
        }
        //Caso o campo de email esteja vazio
        if (!emailBusca.trim()) return;
        try {
            setErro('');

            const response = await getUserByEmail(emailBusca);
            const usuario = response;

            const novoIntegrante = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                fotoPerfil: usuario.foto_perfil,
                nivelAcesso: 3, // Gerente de projeto enquanto a lógica da seleção ainda não funciona
                isOwner: isOwner,
            };

            // Puxa a lista de integrantes, reatribui ela a si mesma e adiciona nosso novo integrante
            setIntegrantes((prev) => {
                // Busca uma correspondência do usuário encontrado na busca na lista de integrantes
                const usuarioNaLista = prev.some((integrante) => integrante.id === usuario.id);

                // Se houve correspondência não adiciona a lista
                if (usuarioNaLista) {
                    return prev;
                }
                //Limpando o campo emailBusca
                emailBusca = null;
                return [...prev, novoIntegrante];
            });
        } catch (error) {
            setErro('Usuário não encontrado');
        }
    }

    return (
        <div>
            <MobileHeader></MobileHeader>
            <div className="flex flex-col px-4 py-[10px] gap-3">
                <Title2>Novo Projeto</Title2>
                <FormInput
                    labelContent="Titulo do Projeto"
                    inputClassName="text-lg"
                    placeholder="Novo Projeto"
                    register={register('titulo', { required: true })}
                ></FormInput>

                <FormInput
                    labelContent="Sobre o projeto"
                    className="h-24"
                    placeholder="Insira uma breve descrição sobre o projeto"
                    register={register('descricao', { required: true })}
                ></FormInput>

                <FormInput
                    labelContent="Integrantes"
                    placeholder="Buscar por email"
                    icon={<Search className="text-(--cinza-700)" />}
                    register={register('email')}
                    onInputSubmit={handleAdicionarIntegrante}
                >
                    {' '}
                    <Search></Search>{' '}
                </FormInput>

                <div className="flex px-14 justify-between">
                    <Title4 className="text-(--cinza-700)">Nome</Title4>
                    <Title4 className="text-(--cinza-700)">Nível de acesso</Title4>
                </div>

                <div className="flex flex-col gap-1">
                    {integrantes.map((integrante) => (
                        <ProjectMember
                            key={integrante.id}
                            integrante={integrante}
                            isOwner={integrante.isOwner}
                            onClose={() => onRemoveIntegrante(integrante.id)}
                        ></ProjectMember>
                    ))}
                </div>
            </div>

            <button
                className="absolute bottom-5 right-5 py-2 px-5 bg-(--color-base) text-white font-semibold rounded-lg text-xl"
                onClick={() => handleSubmit(onSubmit)()}
            >
                Criar Projeto
            </button>
        </div>
    );
}

export default NewProject;
