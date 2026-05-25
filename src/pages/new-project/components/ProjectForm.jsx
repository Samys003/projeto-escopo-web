import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, X } from 'lucide-react';

import { getUserByEmail } from '../../../services/api.js';
import FormInput from '../../../components/FormInput.jsx';
import Title4 from '../../../components/Typography/Title4.jsx';
import ProjectMember from './ProjectMember.jsx';
import { getProjectMembers } from '../services/new-project-endpoints';

function ProjectForm({ mode, initialData, onSubmit, userEmail, projectId = null }) {
    const [integrantes, setIntegrantes] = useState([]);
    const [pendentes, setPendentes] = useState([]);
    const [erro, setErro] = useState('');
    const isEdit = mode === 'edit';

    const {
        register,
        getValues,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            titulo: '',
            descricao: '',
            email: '',
        },
    });

    async function submitForm(data) {
        const formData = {
            ...data,
            integrantes,
        };

        await onSubmit(formData);
    }

    useEffect(() => {
        //Caso seja um novo projeto, irá adicionar o usuário como proprietário
        if (isEdit === false) {
            handleAdicionarIntegrante(userEmail);
            return;
        }
        if (initialData) {
            reset({
                titulo: initialData.titulo,
                descricao: initialData.descricao,
            });

            carregarParticipantes(projectId);
        }

        //TODO: Adicionar verificação do localStorage na página, desconectar usuário com acesso inválido
        //Adicionando o primeiro usuario, o criador do projeto a lista
    }, [isEdit, initialData, reset, userEmail]);

    async function carregarParticipantes(projectId) {
        const response = await getProjectMembers(projectId);

        setIntegrantes(response.participantes);
        setPendentes(response.pendentes);
    }

    function onRemoveIntegrante(integranteId) {
        const newIntegrantes = integrantes.filter((integrante) => integrante.id != integranteId);
        setIntegrantes(newIntegrantes);
    }

    //Por padrão ele vai executar recebendo o valor do emailBusca
    async function handleAdicionarIntegrante(emailParam = null) {
        // emailParam é usado para inserir o email do proprietario quando vai criar o projeto.
        var isOwner = emailParam;

        // Armazenando email para realizar a busca, usando o emailParams ou o do input
        var emailBusca = emailParam || getValues('email');

        //Caso o campo de email esteja vazio
        if (!emailBusca.trim()) {
            setErro('Insira um email para buscar um usuário');
            return;
        }

        try {
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

    //Quando o usuário mudar o nível de acesso de um integrante
    function handleNivelAcessoChange(integranteId, novoNivel) {
        //Atualizar a lista de integrantes atualizando o nível de acesso daquele integrante em específico
        setIntegrantes((prev) =>
            prev.map((integrante) =>
                integrante.id === integranteId
                    ? //Caso seja o integrante correspondente irá atualizar antes de inserir no array
                      {
                          ...integrante,
                          nivelAcesso: Number(novoNivel),
                      }
                    : //Caso contrário mantém como está.
                      integrante,
            ),
        );
    }
    return (
        <div className="flex flex-col gap-4">
            <FormInput
                labelContent="Titulo do Projeto"
                inputClassName="text-lg lg:text-xl"
                placeholder="Novo Projeto"
                register={register('titulo', { required: true })}
            ></FormInput>

            <FormInput
                labelContent="Sobre o projeto"
                inputClassName="lg:text-base font-normal"
                placeholder="Insira uma breve descrição sobre o projeto"
                allowEnter={true}
                register={register('descricao', { required: true })}
                textRows={3}
            ></FormInput>

            <FormInput
                labelContent="Integrantes"
                placeholder="Buscar por email"
                icon={<Search className="text-(--cinza-700)" />}
                register={register('email')}
                onInputSubmit={handleAdicionarIntegrante}
            >
                <Search></Search>
            </FormInput>

            <div className="flex flex-col gap-4 xl:gap-6">
                <div className="flex flex-col gap-2 xl:px-[20%]">
                    <div
                        className="flex px-14 justify-between
                    lg:justify-around"
                    >
                        <Title4
                            className="text-(--cinza-700)
                        lg:text-xl"
                        >
                            Nome
                        </Title4>
                        <Title4
                            className="text-(--cinza-700)
                        lg:text-xl"
                        >
                            Nível de acesso
                        </Title4>
                    </div>
                    <div className="flex flex-col gap-1">
                        {integrantes.map((integrante) => (
                            <ProjectMember
                                key={integrante.id}
                                integrante={integrante}
                                isOwner={integrante.isOwner}
                                onClose={() => onRemoveIntegrante(integrante.id)}
                                onNivelAcessoChange={handleNivelAcessoChange}
                            ></ProjectMember>
                        ))}
                    </div>
                </div>
                {mode === 'edit' && (
                    <div className="flex flex-col gap-2 xl:px-[20%]">
                        <div className="flex flex-col items-center">
                            <Title4
                                className="text-(--cinza-500)
                            lg:text-xl"
                            >
                                Convites Pendentes
                            </Title4>
                        </div>
                        <div className="flex flex-col gap-1">
                            {pendentes.map((pendente) => (
                                <ProjectMember
                                    key={pendente.id}
                                    integrante={pendente}
                                    onClose={() => onRemoveIntegrante(integrante.id)}
                                    pendente={true}
                                    // TODO: Adicionar método para remover convite
                                    onNivelAcessoChange={handleNivelAcessoChange}
                                ></ProjectMember>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full flex flex-col items-end">
                <button
                    className="
                    py-2 px-5 bg-(--color-base) text-white font-semibold rounded-lg text-xl w-min text-nowrap
                    lg:py-3>"
                    onClick={() => handleSubmit(submitForm)()}
                >
                    Atualizar Projeto
                </button>
            </div>
        </div>
    );
}

export default ProjectForm;
