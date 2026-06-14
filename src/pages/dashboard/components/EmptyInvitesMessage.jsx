import Title3 from '../../../components/Typography/Title3';
import ParagraphLarge from '../../../components/Typography/ParagraphLarge';
import iconLetter from '../../../assets/icons/icon-letter-open.svg';

function EmptyInvitesMessage() {
    return (
        <div
            className="flex-col border-[2px] py-8 px-6 border-(--cinza-300) rounded-xl bg-white items-center self-center
        lg:w-82"
        >
            <Title3 className="text-(--cinza-700) font-semibold text-center">
                Sem convites no momento
            </Title3>
            <ParagraphLarge className="text-(--cinza-500) text-center">
                Quando alguém te convidar para um projeto, o convite irá aparecer aqui.
            </ParagraphLarge>
            <div className="flex justify-center">
                <img src={iconLetter} className=""></img>
            </div>
        </div>
    );
}

export default EmptyInvitesMessage;
