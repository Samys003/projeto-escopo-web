import ParagraphLarge from '../../../components/Typography/ParagraphLarge.jsx';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium.jsx';
import Title3 from '../../../components/Typography/Title3.jsx';
import Title2 from '../../../components/Typography/Title2.jsx';

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
            'Sem limites de colaboradores',
            'Sem limites de clientes',
            'Transcrição de reuniões',
        ],
    },
];

function Planos({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
            <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] border border-[#e5e7eb]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full bg-[#f5f3ff] p-2 text-[var(--color-base)] hover:bg-[#2d00f5] transition-colors"
                    aria-label="Fechar"
                >
                    ×
                </button>
                <div className="px-6 py-7">
                    <div className="mb-6 text-center"></div>
                    <div className="space-y-6">
                        {plans.map((plan, index) => (
                            <div
                                key={plan.name}
                                className={`rounded-[28px] ${
                                    index === 0
                                        ? 'border-[#ede9ff] bg-[#ffffff]'
                                        : 'border-[#e5e7eb] bg-white'
                                }`}
                            >
                                <div className="text-center">
                                    <Title3 className="text-gray-900">{plan.name}</Title3>
                                    <ParagraphLarge className="text-[26px] font-semibold text-[var(--color-base)] mt-2">
                                        {plan.price}
                                    </ParagraphLarge>
                                    <ParagraphMedium className="text-gray-500 mt-1">
                                        {plan.subtitle}
                                    </ParagraphMedium>
                                </div>
                                <ul className="mt-5 space-y-2 text-sm text-gray-800">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex gap-2">
                                            <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-base)]" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 border-t border-[var(--color-base)] pt-4 text-center">
                                    <button
                                        type="button"
                                        className="text-[#5b21b6] font-semibold hover:text-[var(--color-dark)] transition-colors"
                                        onClick={onClose}
                                    >
                                        Fazer Upgrade
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Planos;
