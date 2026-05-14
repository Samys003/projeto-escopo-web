import logotipoDesktop from '../assets/logotipo-desktop.svg';
import Title3 from './Typography/Title3';
import { Link } from 'react-router-dom';
import { Home, FolderPlus, Menu, Settings, Bell, LogOut } from 'lucide-react';
import IconButton from './IconButton';

function AsideMenu() {
    const itensMenu = [
        { id: 1, nome: 'Dashboard', path: '/dashboard', icon: Home },
        { id: 2, nome: 'Novo Projeto', path: '/novo-projeto', icon: FolderPlus },
        { id: 3, nome: 'Lista de projetos', path: '/projetos', icon: Menu },
    ];

    const iconsMenu = [
        { id: 4, nome: 'Configurações', path: '/configuracao', icon: Settings },
        { id: 5, nome: 'Notificações', path: '/notificacoes', icon: Bell },
        { id: 6, nome: 'Sair', path: '/notificacoes', icon: LogOut },
    ];
    return (
        <aside
            className="hidden lg:flex lg:flex-col
        bg-(--color-base) p-5 gap-7"
        >
            <img src={logotipoDesktop} alt="" className="w-[172px]" />

            <div className="grow">
                <div className="grid gap-3">
                    {itensMenu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className="hover:opacity-70 transition-opacity flex items-center gap-4"
                            >
                                <Icon className="text-white"></Icon>
                                <Title3 className="text-white font-normal">{item.nome}</Title3>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-8">
                {iconsMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className="hover:opacity-70 transition-opacity flex items-center gap-4"
                        >
                            <IconButton
                                icon={<Icon></Icon>}
                                className="bg-(--color-variant)"
                            ></IconButton>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
export default AsideMenu;
