import logotipoMobile from '../assets/logotipo-mobile.svg'
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Title3 from './Typography/Title3';

function MobileHeader(){

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const itensMenu = [
        { id: 1, nome: 'Dashboard', path: '/dashboard' },
        { id: 2, nome: 'Novo Projeto', path: '/novo-projeto' },
        { id: 3, nome: 'Lista de projetos', path: '/projetos' },
        { id: 4, nome: 'Notificações', path: '/notificacoes' },
        { id: 5, nome: 'Configurações', path: '/configuracoes' }
    ]

    return (
        <div className="relative">

            <header className="px-4 bg-(--color-base) flex place-content-between relative z-50">
                <img src={logotipoMobile} alt="" />
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen
                        ? <X className='text-white' />
                        : <Menu className='text-white' />
                    }
                </button>
            </header>

            <div
                className={`
                    fixed top-0 left-0 w-full h-full
                    bg-(--color-base) z-40
                    flex flex-col items-center justify-center gap-4
                    transition-transform duration-300 ease-in-out
                    ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}
                `}
            >
                {itensMenu.map((item) => (
                    <Title3 key={item.id} className='text-white'>
                        {item.nome}
                    </Title3>
                ))}
            </div>

        </div>
    )
}

export default MobileHeader;