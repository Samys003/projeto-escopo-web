import logotipoMobile from '../assets/logotipo-mobile.svg'
import iconMenu from '../assets/icons/icon-menu.svg'

function MobileHeader(){
    return(
        <header className="px-4 bg-(--color-base) flex place-content-between">
            <img src={logotipoMobile} alt="" />
            <img src={iconMenu} alt="" />
        </header>
    )
}
export default MobileHeader;