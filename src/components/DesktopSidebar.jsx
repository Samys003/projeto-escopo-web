import logotipoDesktop from '../assets/logotipo-desktop.svg';
import { Dock, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Title3 from './Typography/Title3';
import { Bell, FolderPlus, Home, List, LogOut, Settings } from 'lucide-react';

const sidebarLinks = [
    { label: 'Dashboard', path: '/dashboard', Icon: Home },
    { label: 'Novo Projeto', path: '/novo-projeto', Icon: FolderPlus },
    { label: 'Lista de projetos', path: '/projetos', Icon: List },
    { label: 'Documento', path: '/documento', Icon: Dock }, // DELETAR, PROVISÓRIO
];

function DesktopSidebar({ onLogout }) {
    return (
        <aside className="hidden min-h-screen w-[280px] shrink-0 flex-col bg-[var(--color-base)] px-8 py-10 text-white lg:flex xl:w-[356px]">
            <Link to="/dashboard" className="mb-12 inline-flex w-fit" aria-label="Escopo">
                <img src={logotipoDesktop} alt="Escopo" className="h-auto w-56 xl:w-60" />
            </Link>

            <nav className="flex flex-col gap-6">
                {sidebarLinks.map(({ label, path, Icon }) => (
                    <Link
                        key={label}
                        to={path}
                        className="flex items-center gap-5 text-[22px] font-semibold text-white transition-opacity hover:opacity-80"
                    >
                        <Icon size={28} strokeWidth={2.3} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto flex items-center gap-11 pl-6">
                <Link
                    to="/configuracao"
                    className="rounded-lg bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                    aria-label="Configurações"
                >
                    <Settings size={27} />
                </Link>
                <button
                    type="button"
                    className="rounded-lg bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                    aria-label="Notificações"
                >
                    <Bell size={27} />
                </button>
                <button
                    type="button"
                    onClick={onLogout}
                    className="rounded-lg bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                    aria-label="Sair"
                >
                    <LogOut size={27} />
                </button>
            </div>
        </aside>
    );
}
export default DesktopSidebar;
