import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, X } from 'lucide-react';

import { getUserByEmail } from '../../../services/api.js';
import FormInput from '../../../components/FormInput.jsx';
import Title4 from '../../../components/Typography/Title4.jsx';
import ProjectMember from './ProjectMember.jsx';
import { getProjectMembers } from '../services/new-project-endpoints';

function ProjectForm({ mode, initialData, onSubmit, userEmail, projectId = null }) {
    const [integrantesAtuais, setIntegrantesAtuais] = useState([]);
    const [integrantesAdicionais, setIntegrantesAdicionais] = useState([]);
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
            integrantes: integrantesAdicionais,
        };

        await onSubmit(formData);
    }

    //Inicia formulário
    // - insere o proprietário caso seja um novo projeto
    // - carrega os participantes caso esteja editando um existente
    useEffect(() => {
        // Em novo projeto, irá adicionar o usuário como proprietário e return early
        if (isEdit === false) {
            handleAdicionarIntegrante(userEmail);
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
    }, [isEdit, initialData, reset, userEmail]);

    // Em editar projeto, carregar os participantes e convites pendentes
    async function initListaParticipantes(projectId) {
        const response = await getProjectMembers(projectId);

        setIntegrantesAtuais(response.participantes);
        setPendentes(response.pendentes);
    }

    //GERENCIAMENTO DE PARTICIPANTES:

    //Realiza busca de usuário para inserir como participante
    // TODO: Revisar essa função, só é utilizada para lidar com o criador do projeto quando cria um projeto.
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
                nivelAcesso: 3, // Por padrão são adicionados como nivel de acesso 3 (cliente), resolver o carregamento do select
                isOwner: isOwner,
            };

            // Puxa a lista de integrantes, reatribui ela a si mesma e adiciona nosso novo integrante
            setIntegrantesAtuais((prev) => {
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

    // Realiza busca de usuário e adiciona na lista como adicional
    async function handleAddIntegranteAdicional() {
        // Armazenando email para realizar a busca, usando o emailParams ou o do input
        var emailBusca = getValues('email');

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
                nivelAcesso: 3, // Por padrão são adicionados como nivel de acesso 3 (cliente), resolver o carregamento do select na tela
            };

            // Puxa a lista de integrantes, reatribui ela a si mesma e adiciona nosso novo integrante
            setIntegrantesAdicionais((prev) => {
                // Confere se o usuário a ser adicionado já participa do projeto
                const usuarioParticipa = integrantesAtuais.some(
                    (integrante) => integrante.id === usuario.id,
                );

                // Busca uma correspondência do usuário encontrado na busca na lista de integrantes
                const usuarioNaLista = prev.some((integrante) => integrante.id === usuario.id);

                // Se houve correspondência não adiciona a lista
                if (usuarioNaLista || usuarioParticipa) {
                    return prev;
                    //TODO: Retornar uma mensagem para o usuário
                }
                //Limpando o campo emailBusca
                emailBusca = null;

                // Adiciona a lista de integrantes adicionais
                return [...prev, novoIntegrante];
            });
        } catch (error) {
            setErro('Usuário não encontrado');
        }
    }

    //Quando o usuário mudar o nível de acesso de um integrante
    function handleNivelAcessoChange(listaType, integranteId, novoNivel) {
        // Lista 1: Integrante já participante do projeto
        if (listaType === 'atuais') {
            setIntegrantesAtuais((prev) =>
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

        // Lista 2: Integrante adicional (a ser convidado pro projeto)
        if (listaType === 'adicionais') {
        }

        // Lista 3: Integrante com convite pendente (ainda não aceitou o convite)
        if (listaType === 'atuais') {
        }
    }

    //Remove um integrante da lista
    function onRemoveIntegranteAtual(integranteId) {
        const newIntegrantes = integrantesAtuais.filter(
            (integrante) => integrante.id != integranteId,
        );
        setIntegrantesAtuais(newIntegrantes);
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
                onInputSubmit={handleAddIntegranteAdicional}
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
                                key={integrante.id}
                                integrante={integrante}
                                isOwner={integrante.isOwner}
                                onClose={() => onRemoveIntegrante(integrante.id)}
                                onNivelAcessoChange={handleNivelAcessoChange}
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
                        {integrantesAdicionais.map((integrante) => (
                            <ProjectMember
                                key={integrante.id}
                                integrante={integrante}
                                isOwner={integrante.isOwner}
                                adicional={true}
                                onClose={() => onRemoveIntegrante(integrante.id)}
                                onNivelAcessoChange={handleNivelAcessoChange}
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
                )}
            </div>
            <div className="w-full flex flex-col items-end">
                <button
                    className="
                    py-2 px-5 bg-(--color-base) text-white font-semibold rounded-lg text-xl w-min text-nowrap
                    lg:py-3>"
                    onClick={() => handleSubmit(submitForm)()}
                >
                    {isEdit ? 'Atualizar Projeto' : 'Criar Projeto'}
                </button>
            </div>
        </div>
    );
}

export default ProjectForm;
