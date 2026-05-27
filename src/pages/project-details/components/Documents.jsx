import { FilePlus, Trash2 } from 'lucide-react';
import IconButton from '../../../components/IconButton';
import ParagraphLarge from '../../../components/Typography/ParagraphLarge';
import Title2 from '../../../components/Typography/Title2';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';

function Documents({ documentos, deletarCategoria, project }) {
    return (
        <div className="w-full flex flex-col gap-3 lg:gap-5">
            {documentos?.projeto?.categorias?.map((doc) => {
                return (
                    <div
                        key={doc.id}
                        className="w-full flex flex-col gap-1 lg:mt-4 lg:gap-3  lg:w-170"
                    >
                        <div className="w-full flex justify-between">
                            <Title2 className="p-0.5 text-(--cinza-600)">
                                {doc.nome?.charAt(0).toUpperCase() + doc.nome?.slice(1)}
                            </Title2>
                            {(project?.nivel_acesso_id === 1 || project?.nivel_acesso_id === 2) && (
                                <IconButton
                                    onClick={() => deletarCategoria(doc.id)}
                                    className="bg-transparent p-0.5 lg:border lg:border-black lg:w-50 lg:flex lg:gap-2"
                                    textClassName="lg:block hidden  lg:text-(--color-base)"
                                    icon={<Trash2 className="text-(--color-base)"></Trash2>}
                                >
                                    Excluir Categoria
                                </IconButton>
                            )}
                        </div>
                        <div className="border w-full flex flex-col p-10.5 lg:gap-4 lg:p-10 items-center gap-2.5 rounded-lg border-(--cinza-300)  lg:justify-between">
                            {doc.documentos.map((subdoc) => {
                                return (
                                    <div key={subdoc.id} className="flex p-1 w-full">
                                        <button className="flex w-full justify-between gap-3 ">
                                            <div className="w-full items-center flex text-start">
                                                <ParagraphLarge className="line-clamp-2">
                                                    {subdoc.titulo}
                                                </ParagraphLarge>

                                                <ParagraphMedium className="text-(--cinza-500) lg:hidden">
                                                    Última Alteração:{' '}
                                                    {new Date(
                                                        subdoc.ultima_alteracao,
                                                    ).toLocaleDateString()}
                                                </ParagraphMedium>
                                            </div>
                                            <div className="flex items-center ">
                                                <ParagraphMedium className="flex h-6 w-6 rounded-sm items-center justify-center bg-(--cinza-400) text-white">
                                                    {subdoc.quantidade_versoes}
                                                </ParagraphMedium>
                                            </div>
                                            <div className="flex w-[60%] items-center gap-1 justify-end">
                                                <ParagraphMedium className="hidden text-(--cinza-500)  lg:block">
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
                                <IconButton className={`gap-2`} icon={<FilePlus />}>
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
