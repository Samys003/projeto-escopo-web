import ParagraphLarge from '../../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import { ListCheck } from 'lucide-react';

function extrairTitulo(descricao) {
    const [, titulo] = String(descricao || '').match(/"([^"]+)"/) || [];
    return titulo || 'Notificação';
}

function Notificacao({ notificacao, layout = 'desktop', onOpen }) {
    const descricao = notificacao?.descricao || notificacao?.description || '';
    const titulo = notificacao?.titulo || notificacao?.title || extrairTitulo(descricao);
    const data = notificacao?.dataFormatada || notificacao?.date || '';

    if (layout === 'mobile') {
        return (
            <button
                type="button"
                onClick={() => onOpen?.(notificacao)}
                className="min-h-[86px] w-full rounded-xl border border-(--cinza-200) bg-white px-[14px] py-[11px] text-left shadow-[0_1px_4px_rgba(0,0,0,0.14)] transition-colors hover:border-(--cinza-300)"
            >
                <div className="flex items-center gap-2">
                    <ListCheck
                        aria-hidden="true"
                        className="h-[30px] w-[30px] shrink-0 text-(--color-verde)"
                        strokeWidth={2.7}
                    />

                    <ParagraphLarge
                        as="h3"
                        className="min-w-0 text-[16px] font-normal leading-tight text-black"
                    >
                        {titulo}
                    </ParagraphLarge>
                </div>

                <ParagraphMedium className="mt-1 pl-2.5 text-[14px] leading-snug text-(--cinza-600)">
                    {descricao}
                </ParagraphMedium>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => onOpen?.(notificacao)}
            className="grid min-h-[73px] w-full grid-cols-[64px_minmax(160px,240px)_minmax(0,1fr)_96px] items-center gap-6 rounded-[10px] border border-(--cinza-300) bg-white px-6 py-4 text-left transition-colors hover:border-(--cinza-400) xl:grid-cols-[88px_minmax(200px,240px)_minmax(0,1fr)_112px] xl:gap-10 xl:px-10"
        >
            <ListCheck
                aria-hidden="true"
                className="mx-auto h-10 w-10 text-(--color-verde)"
                strokeWidth={2.7}
            />

            <ParagraphLarge
                as="h3"
                className="min-w-0 truncate font-normal whitespace-nowrap text-black"
            >
                {titulo}
            </ParagraphLarge>

            <ParagraphMedium className="min-w-0 text-(--cinza-600) md:text-[14px] md:leading-[1.25]">
                {descricao}
            </ParagraphMedium>

            <ParagraphMedium className="justify-self-end text-(--cinza-500) md:text-[14px]">
                {data}
            </ParagraphMedium>
        </button>
    );
}

export default Notificacao;
