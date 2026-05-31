import MobileHeader from '../../components/MobileHeader.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProject } from './services/new-project-endpoints';
import DesktopSidebar from '../../components/DesktopSideBar.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import Alert from './components/Alert.jsx';
import { getProjectById } from './services/new-project-endpoints.js';

function EditProject() {
    const navigate = useNavigate();
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const userEmail = authUser.email;
    const { projetoId } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [submitError, setSubmitError] = useState('');

    function showError(message) {
        setSubmitError(message);
    }

    useEffect(() => {
        carregarDetalhesProjeto(projetoId);
    }, []);

    async function carregarDetalhesProjeto(projetoId) {
        //TODO: Substituir por versão da services em src depois do merge
        try {
            const response = await getProjectById(projetoId);

            setProjectData(response);
        } catch (error) {
            showError(error);
        }
    }

    function estruturarPayloadAtualizacao(formData) {
        const integrantesAtuais = formData.integrantesAtuais.map((integrante) => ({
            usuario_projeto_id: integrante.usuario_projeto_id,
            nivel_acesso_id: integrante.nivel_acesso_id,
        }));

        const integrantesExcluidos = formData.integrantesExcluidos.map((integranteId) => ({
            usuario_projeto_id: integranteId,
        }));

        const convitesAdicionais = formData.integrantesAdicionais.map((integrante) => ({
            usuario_id: integrante.id,
            nivel_acesso_id: integrante.nivel_acesso_id,
        }));

        const convitesPendentes = formData.pendentes.map((convite) => ({
            convite_id: convite.convite_id,
            nivel_acesso_id: convite.nivel_acesso_id,
        }));

        const convitesExcluidos = formData.convitesExcluidos.map((conviteId) => ({
            convite_id: conviteId,
        }));

        const payload = {
            projetoId: projetoId,
            titulo: formData.titulo,
            descricao: formData.descricao,
        };

        if (integrantesAtuais.length || integrantesExcluidos.length) {
            payload.integrantes = {};

            if (integrantesAtuais.length) {
                payload.integrantes.atuais = integrantesAtuais;
            }

            if (integrantesExcluidos.length) {
                payload.integrantes.excluidos = integrantesExcluidos;
            }
        }

        if (convitesAdicionais.length || convitesPendentes.length || convitesExcluidos.length) {
            payload.convites = {};

            if (convitesAdicionais.length) {
                payload.convites.adicionais = convitesAdicionais;
            }

            if (convitesPendentes.length) {
                payload.convites.pendentes = convitesPendentes;
            }

            if (convitesExcluidos.length) {
                payload.convites.excluidos = convitesExcluidos;
            }
        }

        return payload;
    }
    async function handleAtualizarProjeto(formData) {
        const payload = estruturarPayloadAtualizacao(formData);

        try {
            const response = await updateProject(payload);
            navigate(`/projeto/${projetoId}`);
        } catch (error) {
            showError(error);
        }
    }

    return (
        <div className=" lg:flex">
            <MobileHeader></MobileHeader>

            <DesktopSidebar></DesktopSidebar>

            <main
                className="flex flex-col px-4 py-[10px] gap-3 relative
                lg:gap-10 lg:px-12 lg:py-8 lg:w-full"
            >
                {submitError && (
                    <Alert
                        message={submitError}
                        onClose={() => setSubmitError('')}
                        positionClass="bottom-6"
                    ></Alert>
                )}
                <Title2 className="3xl">Editar Projeto</Title2>
                <ProjectForm
                    mode="edit"
                    initialData={projectData}
                    onSubmit={handleAtualizarProjeto}
                    userEmail={userEmail}
                    projectId={projetoId}
                    onError={showError}
                ></ProjectForm>
            </main>
        </div>
    );
}

export default EditProject;
