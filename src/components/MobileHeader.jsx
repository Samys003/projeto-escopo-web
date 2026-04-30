import logotipoMobile from '../assets/logotipo-mobile.svg'
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Title3 from './Typography/Title3';

function MobileHeader(){

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const itensMenu = ['Dashboard', 'Novo Projeto', 'Lista de projetos', 'Notificações', 'Configurações']

    return (
        <div>
            {isMenuOpen ?
                <div className='fixed inset-0 bg-(--color-base) bg-opacity-50 z-50'>
                    <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} icon={<X className='text-white' />}/>
                    <div className='flex flex-col'>
                        {itensMenu.map((item, index) => {
                            return (
                                <Title3 key={index} className='text-white'>{item}</Title3>
                            )
                        })}
                    </div>
                </div>
                :
                <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} icon={<Menu className='text-white'/>}/>
            }
        </div>
    )
}

function Header({isMenuOpen, setIsMenuOpen, icon}) {
    return (
        <header className="px-4 bg-(--color-base) flex place-content-between">
            <img src={logotipoMobile} alt="" />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {icon}
            </button>
        </header>
    )
}

export default MobileHeader;