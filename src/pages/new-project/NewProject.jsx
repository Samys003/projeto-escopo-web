import MobileHeader from '../../components/MobileHeader.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createProject } from './services/new-project-endpoints.js';
import DesktopSidebar from '../../components/DesktopSideBar.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import Alert from './components/Alert.jsx';

function NewProject() {
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const userEmail = authUser.email;
    const [submitError, setSubmitError] = useState('');

    function showError(message) {
        setSubmitError(message);
    }

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
        } catch (error) {
            setSubmitError('Não foi possível criar o projeto');
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
                <Title2 className="3xl">Novo Projeto</Title2>
                <ProjectForm
                    mode="create"
                    initialData={null}
                    onSubmit={handleCriarProjeto}
                    userEmail={userEmail}
                    onError={showError}
                ></ProjectForm>
            </main>
        </div>
    );
}

export default NewProject;
