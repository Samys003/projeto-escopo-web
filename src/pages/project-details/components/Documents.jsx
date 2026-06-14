import { FilePlus, Trash2 } from 'lucide-react';
import IconButton from '../../../components/IconButton';
import ParagraphLarge from '../../../components/Typography/ParagraphLarge';
import Title2 from '../../../components/Typography/Title2';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import { useNavigate } from 'react-router-dom';

function Documents({ documentos, project, setOpenModalDeleteCategoria, novoDocumento }) {
    const navigate = useNavigate();

    return (
        <div className="w-full flex flex-col gap-3 lg:gap-5">
            {documentos?.projeto?.categorias?.map((doc) => {
                return (
                    <div
                        key={doc.id}
                        className="w-full flex flex-col gap-1 lg:mt-4 lg:gap-3  lg:w-170"
                    >
                        <div className="w-full flex justify-between">
                            <Title2 className="p-0.5 text-(--cinza-600) cursor-pointer">
                                {doc.nome?.charAt(0).toUpperCase() + doc.nome?.slice(1)}
                            </Title2>
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <IconButton
                                    onClick={() => setOpenModalDeleteCategoria(doc)}
                                    className="bg-transparent p-0.5 lg:border lg:border-black lg:w-50 lg:flex lg:gap-2 hover:bg-(--roxo-light) cursor-pointer"
                                    textClassName="lg:block hidden  lg:text-(--color-base)"
                                    icon={<Trash2 className="text-(--color-base)"></Trash2>}
                                >
                                    Excluir Categoria
                                </IconButton>
                            )}
                        </div>

                        <div className="border w-full flex flex-col p-10 lg:gap-4 lg:p-10 items-center gap-2.5 rounded-lg border-(--cinza-300)  lg:items-start justify-between">
                            {doc.documentos.map((subdoc) => {
                                return (
                                    <div key={subdoc.id} className="flex items-center   w-full ">
                                        <button
                                            onClick={() => navigate(`/documento/${subdoc.id}`)}
                                            className="flex w-full hover:bg-(--roxo-light) pt-2 pb-2 pl-1 pr-1 rounded-[10px] gap-3 justify-between cursor-pointer"
                                        >
                                            <div className="w-[50%] items-start flex flex-col text-start">
                                                <ParagraphLarge className="line-clamp-2 lg:line-clamp-1 lg:text-ellipsis ">
                                                    {subdoc.titulo}
                                                </ParagraphLarge>

                                                <ParagraphMedium className="text-(--cinza-500) w-full  lg:hidden ">
                                                    Última Alteração:{' '}
                                                    {new Date(
                                                        subdoc.ultima_alteracao,
                                                    ).toLocaleDateString()}
                                                </ParagraphMedium>
                                            </div>
                                            <div className="flex items-center  justify-center w-[15%]">
                                                <ParagraphMedium className="flex h-6 w-6 rounded-sm items-center justify-center bg-(--cinza-400) text-white">
                                                    {subdoc.quantidade_versoes}
                                                </ParagraphMedium>
                                            </div>
                                            <div className="lg:flex hidden w-[35%]  items-center gap-1 justify-end">
                                                <ParagraphMedium className="hidden  text-(--cinza-500) lg:block">
                                                    Última Alteração:{' '}
                                                    {new Date(
                                                        subdoc.ultima_alteracao,
                                                    ).toLocaleDateString()}
                                                </ParagraphMedium>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <IconButton
                                    className={`gap-2 lg:p-3 hover:bg-(--color-dark) cursor-pointer`}
                                    icon={<FilePlus />}
                                    onClick={() => novoDocumento(doc.id)}
                                >
                                    Novo Documento
                                </IconButton>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Documents;
