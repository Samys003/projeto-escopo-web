import logotipoDesktop from '../assets/logotipo-desktop.svg';
import { Bell, FolderPlus, Home, List, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ParagraphLarge from './Typography/ParagraphLarge';

const sidebarLinks = [
    { label: 'Dashboard', path: '/dashboard', Icon: Home },
    { label: 'Novo Projeto', path: '/novo-projeto', Icon: FolderPlus },
    { label: 'Lista de projetos', path: '/projetos', Icon: List },
];

function DesktopSidebar({ onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        onLogout?.();
        navigate('/');
    };

    return (
        <aside
            className="hidden h-screen min-h-0 w-[280px] shrink-0 self-start overflow-hidden bg-cover bg-no-repeat px-8 py-10 text-white lg:sticky lg:top-0 lg:flex lg:flex-col xl:w-[356px]"
            style={{ backgroundImage: 'var(--bar-background)' }}
        >
            <Link
                to="/dashboard"
                className="mb-10 flex w-full shrink-0 justify-center"
                aria-label="Escopo"
            >
                <img src={logotipoDesktop} alt="Escopo" className="h-auto w-56 xl:w-60" />
            </Link>

            <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
                {sidebarLinks.map(({ label, path, Icon }) => (
                    <Link
                        key={label}
                        to={path}
                        className="flex items-center gap-5 text-[22px]  text-white transition-opacity hover:opacity-80"
                    >
                        <Icon size={28} strokeWidth={1.7} />
                        <ParagraphLarge as="span" className="text-[22px] ">
                            {label}
                        </ParagraphLarge>
                    </Link>
                ))}
            </nav>

            <div className="mt-6 flex shrink-0 items-center gap-11 pl-6">
                <Link
                    to="/configuracao"
                    className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                    aria-label="Configuracoes"
                >
                    <Settings size={27} />
                </Link>
                <button
                    type="button"
                    className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                    aria-label="Notificacoes"
                >
                    <Bell size={27} />
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                    aria-label="Sair"
                >
                    <LogOut size={27} />
                </button>
            </div>
        </aside>
    );
}

export default DesktopSidebar;
