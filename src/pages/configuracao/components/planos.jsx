import Title1 from '../../../components/Typography/Title1';
import Title2 from '../../../components/Typography/Title2';
import Title3 from '../../../components/Typography/Title3';

const plans = [
    {
        name: 'Free',
        price: '$0',
        subtitle: 'Uso Acadêmico',
        features: ['2 colaboradores', '2 clientes', 'Transcrição de reuniões'],
    },
    {
        name: 'Standard',
        price: '$50',
        subtitle: 'Uso Comercial',
        features: ['4 colaboradores', '4 clientes', 'Transcrição de reuniões'],
    },
    {
        name: 'Premium',
        price: '$75',
        subtitle: 'Uso Comercial',
        features: [
            'Sem limite de colaboradores',
            'Sem limite de clientes',
            'Transcrição de reuniões',
        ],
    },
];

function InlinePlanCard({ plan, currentPlanName, index, onUpgrade }) {
    const isCurrent = plan.name === currentPlanName;

    return (
        <article
            className={`flex min-h-[285px] flex-col items-center px-4 text-center xl:px-8 ${
                index > 0 ? 'border-l-2 border-[var(--color-variant)]' : ''
            }`}
        >
            <Title3>{plan.name}</Title3>
            <p className="mt-7 text-xl font-semibold text-[var(--color-base)]">{plan.price}</p>
            <p className="mt-6 text-xl text-[var(--cinza-500)]">{plan.subtitle}</p>

            <ul className="mt-16 flex flex-col gap-3 text-left text-base text-black">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {!isCurrent && (
                <button
                    type="button"
                    onClick={onUpgrade}
                    className="mt-auto pt-11 text-xl font-medium text-[var(--color-base)] transition-colors hover:text-[var(--color-dark)]"
                >
                    Fazer Upgrade
                </button>
            )}
        </article>
    );
}

function ModalPlanCard({ plan, currentPlanName, onClose }) {
    const isCurrent = plan.name === currentPlanName;

    return (
        <article
            className={`rounded-2xl border p-5 ${
                isCurrent
                    ? 'border-[var(--color-variant)] bg-[var(--cinza-100)]'
                    : 'border-[var(--color-dark)] bg-white'
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-black">{plan.name}</h3>
                    <p className="mt-2 text-lg font-semibold text-[var(--color-base)]">
                        {plan.price}
                    </p>
                    <p className="mt-1 text-sm text-[var(--cinza-500)]">{plan.subtitle}</p>
                </div>
                {isCurrent && (
                    <span className="rounded-full border border-[var(--color-variant)] px-3 py-1 text-sm font-medium text-[var(--color-variant)]">
                        Atual
                    </span>
                )}
            </div>

            <ul className="mt-5 flex flex-col gap-2 text-sm text-black">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-base)]" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {!isCurrent && (
                <button
                    type="button"
                    className="mt-6 w-full rounded-xl bg-[var(--color-base)] px-4 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-dark)]"
                    onClick={onClose}
                >
                    Fazer Upgrade
                </button>
            )}
        </article>
    );
}

function Planos({ onClose, onUpgrade, currentPlanName = 'Free', variant = 'modal' }) {
    if (variant === 'inline') {
        return (
            <section aria-label="Planos disponíveis">
                <div className="mb-14 flex flex-col items-center gap-4">
                    <h2 className="text-2xl font-medium text-black">Plano Atual:</h2>
                    <span className="min-w-[116px] rounded-md border border-[var(--color-variant)] px-8 py-2 text-center text-lg font-medium text-[var(--color-variant)]">
                        {currentPlanName}
                    </span>
                </div>

                <div className="grid grid-cols-3">
                    {plans.map((plan, index) => (
                        <InlinePlanCard
                            key={plan.name}
                            plan={plan}
                            index={index}
                            currentPlanName={currentPlanName}
                            onUpgrade={onUpgrade}
                        />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="relative max-h-[86vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#e5e7eb] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cinza-100)] text-2xl leading-none text-[var(--color-base)] transition-colors hover:bg-[#eee7ff]"
                    aria-label="Fechar"
                >
                    ×
                </button>

                <div className="px-6 py-8">
                    <div className="mb-6 pr-10">
                        <Title1 className="text-sm font-medium text-[var(--cinza-500)]">
                            Plano Atual
                        </Title1>
                        <Title2 className="text-2xl font-bold text-[var(--cinza-700)]">
                            {currentPlanName}
                        </Title2>
                    </div>

                    <div className="space-y-4">
                        {plans.map((plan) => (
                            <ModalPlanCard
                                key={plan.name}
                                plan={plan}
                                currentPlanName={currentPlanName}
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
