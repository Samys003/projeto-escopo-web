import Title1 from '../../components/Typography/Title1';
import Title2 from '../../components/Typography/Title2';
import Title3 from '../../components/Typography/Title3';
import ParagraphMedium from '../../components/Typography/ParagraphMedium';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileHeader from '../../components/MobileHeader';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { MessagesSquare, ChevronsLeft, History } from 'lucide-react';

function Documento() {
    return (
        <div className="min-h-screen bg-[var(--fundo)] lg:flex">
            <MobileHeader />
            <DesktopSidebar />
            <main className="flex-1 px-5 py-8 sm:px-8 lg:px-8 lg:py-14 xl:px-20">
                <ChevronsLeft className="" strokeWidth={2} />
                <Title2 onclick={() => {}}>Requisitos funcionais</Title2>
                <ParagraphMedium className="text-[var(--color-variant)]">
                    Última atualização: 10/04/2023
                </ParagraphMedium>
                <ParagraphMedium className="text-gray-700">
                    Data de criação: 01/04/2023
                </ParagraphMedium>
                <History
                    className="absolute right-10 flex h-[40px] w-[40px] cursor-pointer items-center justify-center text-[var(--color-variant)]  transition-colors hover:bg-[var(--color-dark)] sm:h-[60px] sm:w-[60px] lg:bottom-2 lg:right-5"
                    strokeWidth={2}
                />
                <MessagesSquare
                    className="absolute bottom-3 right-3 flex h-[40px] w-[40px] rounded-2xl cursor-pointer items-center justify-center  bg-[var(--color-base)]  text-white shadow-[var(--external-shadow)] transition-colors hover:bg-[var(--color-dark)] sm:h-[60px] sm:w-[60px] lg:bottom-2 lg:right-5"
                    strokeWidth={2}
                />

                <div className="rounded-4xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                    <Title2>Requisito 01: Cadastro </Title2>
                    <Title3>1.1:</Title3>
                    <ParagraphMedium>
                        O usuário deverá ser capaz de realizar o cadastro e criar um acesso por meio
                        de um formulário, será solicitado nome, email e senha.
                    </ParagraphMedium>
                    <Title3>1.2:</Title3>
                    <ParagraphMedium>
                        O usuário deverá ser capaz de realizar o cadastro e criar um acesso por meio
                        de um formulário, será solicitado nome, email e senha.
                    </ParagraphMedium>

                    <Title2>Requisito 02: Login </Title2>
                    <Title3>2.1:</Title3>
                    <ParagraphMedium>
                        O usuário terá acesso ao sistema usando o email e senha cadastrados
                    </ParagraphMedium>
                </div>
            </main>
        </div>
    );
}

export default Documento;
