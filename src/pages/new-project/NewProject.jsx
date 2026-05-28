import MobileHeader from '../../components/MobileHeader.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createProject } from './services/new-project-endpoints.js';
import DesktopSidebar from '../../components/DesktopSideBar.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import Alert from './components/Alert.jsx';
import { CircleX } from 'lucide-react';

function NewProject() {
    const navigate = useNavigate();
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const userEmail = authUser.email;
    const [submitError, setSubmitError] = useState('');

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
                <Alert
                    message={submitError}
                    positionClass="bottom-6 left-6"
                    current={{
                        icon: CircleX,
                        container: 'bg-green-600',
                        text: 'text-white',
                    }}
                ></Alert>
                <Title2 className="3xl">Novo Projeto</Title2>
                <ProjectForm
                    mode="create"
                    initialData={null}
                    onSubmit={handleCriarProjeto}
                    userEmail={userEmail}
                    submitError={submitError}
                ></ProjectForm>
            </main>
        </div>
    );
}

export default NewProject;
