import MobileHeader from '../../components/MobileHeader.jsx';
import Title2 from '../../components/Typography/Title2.jsx';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProject } from './services/new-project-endpoints';
import DesktopSidebar from '../../components/DesktopSideBar.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import { getProjectById } from './services/new-project-endpoints.js';

function EditProject() {
    const navigate = useNavigate();
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const userEmail = authUser.email;
    const { projetoId } = useParams();
    const [projectData, setProjectData] = useState(null);

    useEffect(() => {
        carregarDetalhesProjeto(projetoId);
    }, []);

    async function carregarDetalhesProjeto(projetoId) {
        //TODO: Substituir por versão da services em src depois do merge
        try {
            const response = await getProjectById(projetoId);

            setProjectData(response);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleAtualizarProjeto(formData) {
        const payload = {
            titulo: formData.titulo,
            descricao: formData.descricao,
            // integrantes:{
            //     atuais: ,
            //     excluidos:,

            //     id: integrante.id,
            //     nivel_acesso_id: integrante.nivelAcesso,
            // },
            // convites:{
            //     adicionais:,
            //     pendentes:,
            //     excluidos:,
            // }
            // })),
        };

        try {
            const response = await createProject(payload);
            navigate(`/projeto/${response.id}`);
        } catch (error) {
            //TODO: Está faltando tratativa pro response
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
                <Title2 className="3xl">Editar Projeto</Title2>
                <ProjectForm
                    mode="edit"
                    initialData={projectData}
                    onSubmit={handleAtualizarProjeto}
                    userEmail={userEmail}
                    projectId={projetoId}
                ></ProjectForm>
            </main>
        </div>
    );
}

export default EditProject;
