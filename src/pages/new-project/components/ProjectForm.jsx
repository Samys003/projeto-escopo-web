import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, X } from 'lucide-react';

import { getUserByEmail } from '../../../services/api.js';
import FormInput from '../../../components/FormInput.jsx';
import Title4 from '../../../components/Typography/Title4.jsx';
import ProjectMember from './ProjectMember.jsx';
import { getProjectMembers } from '../services/new-project-endpoints';

function ProjectForm({
    mode,
    initialData,
    onSubmit,
    userEmail,
    projectId = null,
    submitError,
    onError,
}) {
    const [integrantesAtuais, setIntegrantesAtuais] = useState([]);
    const [integrantesAdicionais, setIntegrantesAdicionais] = useState([]);
    const [pendentes, setPendentes] = useState([]);
    const [erro, setErro] = useState('');
    const [emailError, setEmailError] = useState('');
    const [integrantesExcluidos, setIntegrantesExcluidos] = useState([]);
    const [convitesExcluidos, setConvitesExcluidos] = useState([]);
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
        let formData;

        // Caso seja um novo projeto
        if (!isEdit) {
            formData = {
                ...data,
                integrantes: integrantesAdicionais,
            };
        }
        // Caso esteja editando um projeto
        else {
            formData = {
                ...data,

                integrantesAtuais,
                integrantesExcluidos,

                integrantesAdicionais,
                pendentes,
                convitesExcluidos,
            };
        }
        await onSubmit(formData);
    }

    //Realiza busca de usuário para inserir como participante em novoProjeto
    async function inserirProprietario() {
        try {
            //TODO: Se colocar o fotoPerfil no authUser dá pra remover essa requisição, puxa tudo do authUser mesmo
            const usuario = await getUserByEmail(userEmail);
            const novoIntegrante = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                foto_perfil: usuario.foto_perfil,
                isOwner: true,
                nivel_acesso_id: 1,
            };

            // Puxa a lista de integrantes, reatribui ela a si mesma e adiciona nosso novo integrante
            setIntegrantesAtuais((prev) => {
                // Busca uma correspondência do usuário encontrado na busca na lista de integrantes
                const usuarioNaLista = prev.some((integrante) => integrante.id === usuario.id);

                // Se houve correspondência não adiciona a lista
                if (usuarioNaLista) {
                    return prev;
                }

                return [...prev, novoIntegrante];
            });
        } catch (error) {
            onError?.('Ocorreu uma falha na requisição');
        }
    }

    //Inicia formulário
    // - insere o proprietário caso seja um novo projeto
    // - carrega os participantes caso esteja editando um existente
    useEffect(() => {
        // Em novo projeto, irá adicionar o usuário como proprietário e return early
        if (!isEdit) {
            inserirProprietario();
            return;
        }
        // Em editar, iremos recarregar o formulário inserindo os dados fornecidos
        if (initialData) {
            reset({
                titulo: initialData.titulo,
                descricao: initialData.descricao,
            });

            initListaParticipantes(projectId);
        }

        //TODO: Adicionar verificação do localStorage na página, desconectar usuário com acesso inválido
    }, [isEdit, initialData, reset]);

    // Em editar projeto, carregar os participantes e convites pendentes
    async function initListaParticipantes(projectId) {
        const response = await getProjectMembers(projectId);

        const participantes = response.participantes.map((participante) => ({
            ...participante,
            isOwner: participante.usuario_id === initialData.criador_id,
            nivel_acesso_id: Number(participante.nivel_acesso_id),
        }));

        setIntegrantesAtuais(participantes);
        setPendentes(response.pendentes);
    }

    //GERENCIAMENTO DE PARTICIPANTES:
    // Realiza busca de usuário e adiciona na lista como adicional
    async function handleAddIntegranteAdicional() {
        // Armazenando email para realizar a busca, usando o emailParams ou o do input
        const emailBusca = getValues('email');

        //Caso o campo de email esteja vazio
        if (!emailBusca.trim()) {
            setEmailError('Insira um email para realizar a busca.');
            return;
        }

        // Busca na lista de integrantes uma correspondência de email inserido
        const usuarioParticipa = integrantesAtuais.some(
            (integrante) => integrante.email === emailBusca,
        );

        // Busca na lista de pendentes uma correspondência de email inserido
        const usuarioConvidado = pendentes.some((pendente) => pendente.email === emailBusca);

        // Busca na lista de adicionais uma correspondência de email inserido
        const usuarioAdicionado = integrantesAdicionais.some(
            (adicional) => adicional.email === emailBusca,
        );

        // Se encontrou alguma correspondência não realiza a requisição
        if (usuarioParticipa || usuarioConvidado || usuarioAdicionado) {
            setEmailError('Esse usuário já foi adicionado');
            return;
        }

        // Realiza busca de usuário na API
        try {
            const usuario = await getUserByEmail(emailBusca);
            const novoIntegrante = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                fotoPerfil: usuario.foto_perfil,
                nivel_acesso_id: 4, // Por padrão são adicionados como nivel de acesso 4 (cliente)
            };

            //Limpando o campo de email
            reset({ email: '' });
            setIntegrantesAdicionais((prev) => {
                // Puxa a lista de integrantes, reatribui ela a si mesma e adiciona nosso novo integrante
                // Adiciona a lista de integrantes adicionais
                return [...prev, novoIntegrante];
            });
        } catch (error) {
            onError('Usuário não encontrado ou ocorreu uma falha na requisição');
        }
    }

    function atualizarNivelAcessoIntegrante(usuarioProjetoId, novoNivel) {
        setIntegrantesAtuais((prev) =>
            prev.map((integrante) => {
                // Caso não seja o integrante que estamos atualizando o nivel de acesso
                if (integrante.usuario_projeto_id !== usuarioProjetoId) {
                    return integrante;
                }
                // caso contrário, iremos atualizar e inserir o array
                return {
                    ...integrante,
                    nivel_acesso_id: Number(novoNivel),
                };
            }),
        );
    }

    function atualizarNivelAcessoConvite(conviteId, novoNivel) {
        setPendentes((prev) =>
            prev.map((pendente) => {
                // Caso não seja o convite que estamos atualizando o nivel de acesso
                if (pendente.convite_id !== conviteId) {
                    return pendente;
                }
                // caso contrário, iremos atualizar e inserir o array
                return {
                    ...pendente,
                    nivel_acesso_id: Number(novoNivel),
                };
            }),
        );
    }
    function atualizarNivelAcessoAdicional(usuarioId, novoNivel) {
        setIntegrantesAdicionais((prev) =>
            prev.map((adicional) => {
                // Caso não seja o convite que estamos atualizando o nivel de acesso
                if (adicional.id !== usuarioId) {
                    return adicional;
                }
                // caso contrário, iremos atualizar e inserir o array
                return {
                    ...adicional,
                    nivel_acesso_id: Number(novoNivel),
                };
            }),
        );
    }

    function onRemoveIntegranteAtual(integranteId) {
        setIntegrantesAtuais((prev) =>
            prev.filter((integrante) => integrante.usuario_projeto_id !== integranteId),
        );
        setIntegrantesExcluidos((prev) => [...prev, integranteId]);
    }

    function onRemovePendente(conviteId) {
        setPendentes((prev) => prev.filter((convite) => convite.convite_id !== conviteId));
        setConvitesExcluidos((prev) => [...prev, conviteId]);
    }

    function onRemoveAdicional(adicionalId) {
        setIntegrantesAdicionais((prev) =>
            prev.filter((adicional) => adicional.id !== adicionalId),
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <FormInput
                labelContent="Titulo do Projeto"
                inputClassName="lg:text-base font-normal"
                placeholder="Novo Projeto"
                register={register('titulo', { required: true })}
                error={
                    errors?.titulo?.type === 'required' ? 'O título precisa ser preenchido' : null
                }
            ></FormInput>

            <FormInput
                labelContent="Sobre o projeto"
                inputClassName="lg:text-base font-normal"
                placeholder="Insira uma breve descrição sobre o projeto"
                allowEnter={true}
                register={register('descricao')}
                textRows={3}
            ></FormInput>

            <FormInput
                labelContent="Integrantes"
                placeholder="Buscar por email"
                icon={<Search className="text-(--cinza-700)" />}
                register={register('email', { onChange: () => setEmailError('') })}
                onInputSubmit={handleAddIntegranteAdicional}
                error={emailError}
            >
                <Search></Search>
            </FormInput>

            {/*VERSÃO 1.0: Só exibe os integrantes atuais e pendentes*/}
            {/*VERSÃO 1.1 (Atual): Para novo projeto exibir os adicionais depois dos atuais*/}
            {/*VERSÃO 1.2: Adicionar verificação do isEdit para incluir os adicionais ANTES dos atuais*/}
            {/*VERSÃO 1.3: Revisar para o isEdit validar quem é o proprietário do projeto */}
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
                        {integrantesAtuais.map((integrante) => (
                            <ProjectMember
                                key={integrante.usuario_projeto_id}
                                integrante={integrante}
                                id={integrante.usuario_projeto_id}
                                isOwner={integrante.isOwner}
                                onClose={() =>
                                    onRemoveIntegranteAtual(integrante.usuario_projeto_id)
                                }
                                onNivelAcessoChange={(integranteId, novoNivel) =>
                                    atualizarNivelAcessoIntegrante(integranteId, novoNivel)
                                }
                            ></ProjectMember>
                        ))}
                    </div>
                    <Title4
                        className="text-(--cinza-700)
                        lg:text-xl"
                    >
                        {integrantesAdicionais.length > 0 && 'Adicionar Participantes'}
                    </Title4>
                    <div className="flex flex-col gap-1">
                        {integrantesAdicionais.map((adicional) => (
                            <ProjectMember
                                key={adicional.id}
                                integrante={adicional}
                                id={adicional.id}
                                isOwner={adicional.isOwner}
                                adicional={true}
                                onClose={() => onRemoveAdicional(adicional.id)}
                                onNivelAcessoChange={(integranteId, novoNivel) =>
                                    atualizarNivelAcessoAdicional(integranteId, novoNivel)
                                }
                            ></ProjectMember>
                        ))}
                    </div>
                </div>
                {mode === 'edit' && (
                    <div className="flex flex-col gap-2 xl:px-[20%]">
                        {pendentes.length > 0 && (
                            <div>
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
                                            key={pendente.convite_id}
                                            integrante={pendente}
                                            id={pendente.convite_id}
                                            onClose={() => onRemovePendente(pendente.convite_id)}
                                            pendente={true}
                                            // TODO: Adicionar método para remover convite
                                            onNivelAcessoChange={(conviteId, novoNivel) =>
                                                atualizarNivelAcessoConvite(conviteId, novoNivel)
                                            }
                                        ></ProjectMember>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="w-full flex flex-col items-end ">
                <button
                    className="
                    py-2 px-5 bg-(--color-base) text-white font-semibold rounded-lg text-xl w-min text-nowrap
                    lg:py-3>
                    hover:cursor-pointer"
                    onClick={() => handleSubmit(submitForm)()}
                >
                    {isEdit ? 'Atualizar Projeto' : 'Criar Projeto'}
                </button>
            </div>
        </div>
    );
}

export default ProjectForm;
