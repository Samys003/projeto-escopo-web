import ParagraphLarge from '../../../components/Typography/ParagraphLarge.jsx';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium.jsx';
import Title2 from '../../../components/Typography/Title2.jsx';
import Title3 from '../../../components/Typography/Title3.jsx';
import Title4 from '../../../components/Typography/Title4.jsx';
import { plans } from './planos-data.js';

function InlinePlanCard({ plan, currentPlanName, index }) {
    const isCurrent = plan.name === currentPlanName;

    return (
        <article
            className={`flex min-h-[285px] flex-col items-center px-4 text-center xl:px-8 ${
                index > 0 ? 'border-l-2 border-[var(--color-variant)]' : ''
            }`}
        >
            <Title3 className="text-black">{plan.name}</Title3>
            <ParagraphLarge className="mt-7 text-xl font-semibold text-[var(--color-base)]">
                {plan.price}
            </ParagraphLarge>
            <ParagraphLarge className="mt-6 text-xl text-[var(--cinza-500)]">
                {plan.subtitle}
            </ParagraphLarge>

            <ul className="mt-16 flex flex-col gap-3 text-left">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                        <ParagraphMedium className="text-base text-black">
                            {feature}
                        </ParagraphMedium>
                    </li>
                ))}
            </ul>

            {!isCurrent && (
                <button
                    type="button"
                    className="mt-auto pt-11 text-xl font-medium text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)]"
                >
                    Fazer Upgrade
                </button>
            )}
        </article>
    );
}

function ModalPlanCard({ plan, index, onClose }) {
    return (
        <div className={`rounded-[28px] ${index === 0 ? 'bg-[var(--cinza-100)]' : 'bg-white'}`}>
            <div className="text-center">
                <Title3 className="text-black">{plan.name}</Title3>
                <ParagraphLarge className="mt-2 text-[26px] font-semibold text-[var(--color-base)]">
                    {plan.price}
                </ParagraphLarge>
                <ParagraphMedium className="mt-1 text-[var(--cinza-500)]">
                    {plan.subtitle}
                </ParagraphMedium>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-[var(--cinza-700)]">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-base)]" />
                        <ParagraphMedium>{feature}</ParagraphMedium>
                    </li>
                ))}
            </ul>

            <div className="mt-6 border-t border-[var(--color-base)] pt-4 text-center">
                <button
                    type="button"
                    className="font-semibold text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)]"
                    onClick={onClose}
                >
                    Fazer Upgrade
                </button>
            </div>
        </div>
    );
}

function Planos({ onClose, currentPlanName = 'Free', variant = 'modal' }) {
    if (variant === 'inline') {
        return (
            <section aria-label="Planos disponíveis">
                <div className="mb-14 flex flex-col items-center gap-4">
                    <Title2 className="text-black">Plano Atual:</Title2>
                    <Title4 className="min-w-[116px] rounded-md border border-[var(--color-variant)] px-8 py-2 text-center text-[var(--color-variant)]">
                        {currentPlanName}
                    </Title4>
                </div>

                <div className="grid grid-cols-3">
                    {plans.map((plan, index) => (
                        <InlinePlanCard
                            key={plan.name}
                            plan={plan}
                            index={index}
                            currentPlanName={currentPlanName}
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="relative max-h-[80vh] w-full max-w-md overflow-y-auto rounded-[32px] border border-[var(--cinza-200)] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full bg-[var(--cinza-100)] px-2 py-0.5 text-2xl leading-none text-[var(--color-base)] transition-colors hover:bg-[var(--color-variant)]"
                    aria-label="Fechar"
                >
                    ×
                </button>

                <div className="px-6 py-7">
                    <div className="mb-6 text-center" />
                    <div className="space-y-6">
                        {plans.map((plan, index) => (
                            <ModalPlanCard
                                key={plan.name}
                                plan={plan}
                                index={index}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Planos;
