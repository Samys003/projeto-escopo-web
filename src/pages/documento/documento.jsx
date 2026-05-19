import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import Title2 from '../../components/Typography/Title2';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import { ChevronsLeft, History, MessagesSquare } from 'lucide-react';

function Documento() {
    return (
        <div className="min-h-screen bg-[var(--fundo)] lg:flex">
            <MobileHeader />
            <DesktopSidebar />

            <main className="flex-1 px-4 pb-4 pt-3 sm:px-8 lg:px-8 lg:py-14 xl:px-20">
                <section className="mx-auto max-w-[700px] lg:max-w-[900px]">
                    <div className="relative border-b border-[var(--cinza-400)] pb-2">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <ChevronsLeft className="h-8 w-8 text-gray-900" strokeWidth={3} />
                                <Title2 className="text-[26px] leading-none text-black">
                                    Requisitos Funcionais
                                </Title2>
                            </div>

                            <ParagraphMedium className="text-[var(--color-variant)]">
                                Última Alteração: 16/05/2026
                            </ParagraphMedium>
                            <ParagraphMedium className="text-black">
                                Data de criação: 17/03/2026
                            </ParagraphMedium>
                        </div>

                        <div className="absolute bottom-2 right-3 flex items-center gap-7">
                            <History
                                className="h-10 w-10 cursor-pointer text-[var(--color-variant)]"
                                strokeDasharray="8 8"
                                strokeWidth={2}
                            />
                            <button
                                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-base)] text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)]"
                                type="button"
                            >
                                <MessagesSquare className="h-6 w-6" strokeWidth={2} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 min-h-[610px] rounded-2xl border border-[var(--cinza-300)] bg-white px-4 py-4 text-black sm:px-6">
                        <h3 className="mb-5 font-inter text-[16px] font-normal">
                            Requisito 01: Cadastro
                        </h3>

                        <div className="mb-5 grid grid-cols-[28px_1fr] gap-2 font-inter text-[16px] leading-6">
                            <span>1.1:</span>
                            <p>
                                O usuário deverá ser capaz de realizar o cadastro e criar um acesso por
                                meio de um formulário, será solicitado nome, email e senha.
                            </p>
                        </div>

                        <p className="mb-5 font-inter text-[16px] leading-6">
                            1.2: O sistema irá enviar um email validação do cadastro
                        </p>

                        <h3 className="mb-5 font-inter text-[16px] font-normal">
                            Requisito 02: Login
                        </h3>

                        <p className="font-inter text-[16px] leading-6">
                            2.1: O usuário terá acesso ao sistema usando o email e senha cadastrados
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Documento;
