import logotipoMobile from '../assets/logotipo-mobile.svg';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Title3 from './Typography/Title3';

function MobileHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const itensMenu = [
        { id: 1, nome: 'Dashboard', path: '/dashboard' },
        { id: 2, nome: 'Novo Projeto', path: '/novo-projeto' },
        { id: 3, nome: 'Lista de projetos', path: '/projetos' },
        { id: 4, nome: 'Notificações', path: '/notificacoes' },
        { id: 5, nome: 'Configurações', path: '/configuracao' },
    ];

    return (
        <div className="relative lg:hidden">
            <header
                className="relative z-[1000] flex h-[38px] items-center justify-between overflow-hidden bg-cover bg-no-repeat px-4"
                style={{ backgroundImage: 'var(--bar-background)' }}
            >
                <img src={logotipoMobile} alt="" className="h-[38px] w-[161px] object-fill" />
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex h-9 w-9 items-center justify-center text-white"
                    aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </header>

            <div
                className={`
                    fixed top-0 left-0 w-full h-full
                    bg-cover bg-no-repeat z-[999]
                    flex flex-col items-center justify-center gap-4
                    transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}
                    `}
                style={{ backgroundImage: 'var(--bar-background)' }}
            >
                {itensMenu.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="hover:opacity-70 transition-opacity"
                    >
                        <Title3 className="text-white">{item.nome}</Title3>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default MobileHeader;
