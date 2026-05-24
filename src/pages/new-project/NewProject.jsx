import MobileHeader from '../../components/MobileHeader.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import ButtonText from '../../components/Typography/ButtonText.jsx';
import { getUserByEmail } from '../../services/api.js';
import Title4 from '../../components/Typography/Title4.jsx';
import ParagraphMedium from '../../components/Typography/ParagraphMedium.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from './services/new-project-endpoints';
import DesktopSidebar from '../../components/DesktopSideBar.jsx';
import ProjectForm from './components/ProjectForm.jsx';

function NewProject() {
    const navigate = useNavigate();
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const userEmail = authUser.email;

    async function handleCriarProjeto(formData) {
        const payload = {
            titulo: formData.titulo,
            descricao: formData.descricao,
            integrantes: formData.integrantes.map((integrante) => ({
                id: integrante.id,
                nivel_acesso_id: integrante.nivelAcesso,
            })),
        };

        try {
            const response = await createProject(payload);
            navigate(`/projeto/${response.id}`);
        } catch (error) {}

        //TODO: Está faltando tratativa pro response do create
    }

    return (
        <div className=" lg:flex">
            <MobileHeader></MobileHeader>

            <DesktopSidebar></DesktopSidebar>

            <main
                className="flex flex-col px-4 py-[10px] gap-3 relative
                lg:gap-10 lg:px-12 lg:py-8 lg:w-full"
            >
                <Title2 className="3xl">Novo Projeto</Title2>
                <ProjectForm
                    mode="create"
                    initialData={null}
                    onSubmit={handleCriarProjeto}
                    userEmail={userEmail}
                ></ProjectForm>
                {/* <div className="flex flex-col gap-3">
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

                    <div className="xl:px-[20%]">
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
                                ></ProjectMember>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-end">
                        <button
                            className="
                        py-2 px-5 bg-(--color-base) text-white font-semibold rounded-lg text-xl w-min text-nowrap
                        lg:py-3>"
                            onClick={() => handleSubmit(onSubmit)()}
                        >
                            Criar Projeto
                        </button>
                    </div>
                </div> */}
            </main>
        </div>
    );
}

export default NewProject;
