import logotipoMobile from '../assets/logotipo-mobile.svg'
import iconMenu from '../assets/icon-menu.svg'

function PageHeader(){
    return(
        <header className="px-[16px] bg-[var(--color-base)] flex place-content-between">
            <img src={logotipoMobile} alt="" />
            <img src={iconMenu} alt="" />
        </header>
    )
}
export default PageHeader;