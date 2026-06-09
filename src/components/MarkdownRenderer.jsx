import { Link } from 'react-router-dom';
import ParagraphLarge from './Typography/ParagraphLarge';
import ParagraphMedium from './Typography/ParagraphMedium';
import Title2 from './Typography/Title2';
import Title3 from './Typography/Title3';
import Title4 from './Typography/Title4';

function linkSeguro(url) {
    return /^(https?:|mailto:|\/)/i.test(url) ? url : '#';
}

function renderizarInline(texto, chaveBase) {
    const partes = [];
    const regex =
        /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\*[^*]+\*|_[^_]+_)/g;
    let ultimoIndice = 0;
    let indice = 0;

    for (const match of String(texto || '').matchAll(regex)) {
        if (match.index > ultimoIndice) {
            partes.push(texto.slice(ultimoIndice, match.index));
        }

        const trecho = match[0];
        const chave = `${chaveBase}-${indice}`;

        if (trecho.startsWith('**') && trecho.endsWith('**')) {
            partes.push(
                <strong key={chave} className="font-semibold">
                    {trecho.slice(2, -2)}
                </strong>,
            );
        } else if (trecho.startsWith('__') && trecho.endsWith('__')) {
            partes.push(
                <strong key={chave} className="font-semibold">
                    {trecho.slice(2, -2)}
                </strong>,
            );
        } else if (trecho.startsWith('~~') && trecho.endsWith('~~')) {
            partes.push(
                <del key={chave} className="text-[var(--cinza-500)]">
                    {trecho.slice(2, -2)}
                </del>,
            );
        } else if (trecho.startsWith('*') && trecho.endsWith('*')) {
            partes.push(
                <em key={chave} className="italic">
                    {trecho.slice(1, -1)}
                </em>,
            );
        } else if (trecho.startsWith('_') && trecho.endsWith('_')) {
            partes.push(
                <em key={chave} className="italic">
                    {trecho.slice(1, -1)}
                </em>,
            );
        } else if (trecho.startsWith('`') && trecho.endsWith('`')) {
            partes.push(
                <code
                    key={chave}
                    className="rounded bg-[var(--cinza-200)] px-1 py-0.5 font-mono text-[13px]"
                >
                    {trecho.slice(1, -1)}
                </code>,
            );
        } else if (trecho.startsWith('http')) {
            partes.push(
                <a
                    key={chave}
                    href={linkSeguro(trecho)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-base)] underline underline-offset-2"
                >
                    {trecho}
                </a>,
            );
        } else {
            const [, textoLink, url] = trecho.match(/^\[([^\]]+)\]\(([^)]+)\)$/) || [];
            const destino = linkSeguro(url || '');
            const className = 'text-[var(--color-base)] underline underline-offset-2';

            partes.push(
                destino.startsWith('/') ? (
                    <Link key={chave} to={destino} className={className}>
                        {textoLink || trecho}
                    </Link>
                ) : (
                    <a
                        key={chave}
                        href={destino}
                        target="_blank"
                        rel="noreferrer"
                        className={className}
                    >
                        {textoLink || trecho}
                    </a>
                ),
            );
        }

        ultimoIndice = match.index + trecho.length;
        indice += 1;
    }

    if (ultimoIndice < String(texto || '').length) {
        partes.push(String(texto || '').slice(ultimoIndice));
    }

    return partes;
}

function BlocoCodigo({ linhas, linguagem, chave }) {
    return (
        <pre
            key={chave}
            className="mb-4 max-w-full overflow-x-auto rounded-lg bg-[var(--cinza-700)] px-4 py-3 text-white"
        >
            {linguagem && (
                <span className="mb-2 block font-inter text-xs uppercase tracking-wide text-[var(--cinza-300)]">
                    {linguagem}
                </span>
            )}
            <code className="whitespace-pre font-mono text-[13px] leading-6">
                {linhas.join('\n')}
            </code>
        </pre>
    );
}

function celulasTabela(linha) {
    return String(linha || '')
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((celula) => celula.trim());
}

function ehLinhaTabela(linha) {
    return /^\s*\|.+\|\s*$/.test(linha);
}

function ehSeparadorTabela(linha) {
    const celulas = celulasTabela(linha);

    return celulas.length > 0 && celulas.every((celula) => /^:?-{3,}:?$/.test(celula));
}

function classeAlinhamentoTabela(separador) {
    if (/^:-{3,}:$/.test(separador)) {
        return 'text-center';
    }

    if (/^-{3,}:$/.test(separador)) {
        return 'text-right';
    }

    return 'text-left';
}

function normalizarCelulas(celulas, total) {
    return Array.from({ length: total }, (_, index) => celulas[index] || '');
}

function TabelaMarkdown({ tabela, chave }) {
    const totalColunas = tabela.cabecalhos.length;
    const alinhamentos = tabela.alinhamentos;

    return (
        <div
            key={chave}
            className="mb-4 max-w-full overflow-x-auto rounded-lg border border-[var(--cinza-300)]"
        >
            <table className="w-full min-w-[520px] border-collapse bg-white">
                <thead className="bg-[var(--cinza-100)]">
                    <tr>
                        {tabela.cabecalhos.map((cabecalho, index) => (
                            <th
                                scope="col"
                                key={`th-${index}`}
                                className={`border-b border-r border-[var(--cinza-300)] px-3 py-2 font-inter text-[14px] font-semibold text-black last:border-r-0 ${alinhamentos[index] || 'text-left'}`}
                            >
                                {renderizarInline(cabecalho, `${chave}-th-${index}`)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tabela.linhas.map((linha, linhaIndex) => (
                        <tr key={`tr-${linhaIndex}`} className="even:bg-[var(--cinza-100)]">
                            {normalizarCelulas(linha, totalColunas).map((celula, celulaIndex) => (
                                <td
                                    key={`td-${linhaIndex}-${celulaIndex}`}
                                    className={`align-top break-words border-b border-r border-[var(--cinza-300)] px-3 py-2 font-inter text-[14px] text-black last:border-r-0 [overflow-wrap:anywhere] ${alinhamentos[celulaIndex] || 'text-left'}`}
                                >
                                    {renderizarInline(
                                        celula,
                                        `${chave}-td-${linhaIndex}-${celulaIndex}`,
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function MarkdownRenderer({ valor, emptyMessage = 'Clique para começar a escrever.' }) {
    const elementos = [];
    const linhas = String(valor || '').split('\n');
    let listaAtual = null;
    let paragrafoAtual = [];
    let blocoCodigo = null;
    let tabelaAtual = null;

    function fecharParagrafo() {
        if (paragrafoAtual.length === 0) {
            return;
        }

        const texto = paragrafoAtual.join('\n');

        elementos.push(
            <ParagraphLarge
                key={`p-${elementos.length}`}
                className="mb-3 whitespace-pre-wrap break-words leading-7 text-black [overflow-wrap:anywhere]"
            >
                {renderizarInline(texto, `p-${elementos.length}`)}
            </ParagraphLarge>,
        );
        paragrafoAtual = [];
    }

    function fecharLista() {
        if (!listaAtual) {
            return;
        }

        const Component = listaAtual.tipo === 'ol' ? 'ol' : 'ul';
        const classeLista =
            listaAtual.tipo === 'ol'
                ? 'mb-4 list-decimal space-y-1 pl-6'
                : 'mb-4 list-disc space-y-1 pl-6';

        elementos.push(
            <Component key={`lista-${elementos.length}`} className={classeLista}>
                {listaAtual.itens.map((item, index) => (
                    <ParagraphMedium
                        as="li"
                        key={`${listaAtual.tipo}-${index}`}
                        className="break-words text-[16px] leading-7 text-black [overflow-wrap:anywhere]"
                    >
                        {renderizarInline(item, `${listaAtual.tipo}-${index}`)}
                    </ParagraphMedium>
                ))}
            </Component>,
        );
        listaAtual = null;
    }

    function fecharBlocoCodigo() {
        if (!blocoCodigo) {
            return;
        }

        elementos.push(
            <BlocoCodigo
                key={`codigo-${elementos.length}`}
                chave={`codigo-${elementos.length}`}
                linhas={blocoCodigo.linhas}
                linguagem={blocoCodigo.linguagem}
            />,
        );
        blocoCodigo = null;
    }

    function fecharTabela() {
        if (!tabelaAtual) {
            return;
        }

        elementos.push(
            <TabelaMarkdown
                key={`tabela-${elementos.length}`}
                chave={`tabela-${elementos.length}`}
                tabela={tabelaAtual}
            />,
        );
        tabelaAtual = null;
    }

    linhas.forEach((linha, index) => {
        const marcadorCodigo = linha.trim().match(/^(`{3,}|'{3,})\s*([\w-]+)?\s*$/);

        if (blocoCodigo) {
            if (marcadorCodigo && marcadorCodigo[1][0] === blocoCodigo.marcador[0]) {
                fecharBlocoCodigo();
                return;
            }

            blocoCodigo.linhas.push(linha);
            return;
        }

        if (marcadorCodigo) {
            fecharParagrafo();
            fecharLista();
            fecharTabela();
            blocoCodigo = {
                marcador: marcadorCodigo[1],
                linguagem: marcadorCodigo[2] || '',
                linhas: [],
            };
            return;
        }

        const textoLimpo = linha.trim();

        if (!textoLimpo) {
            fecharParagrafo();
            fecharLista();
            fecharTabela();
            return;
        }

        const linhaTabela = ehLinhaTabela(linha);
        const separadorTabela = ehSeparadorTabela(linha);

        if (tabelaAtual) {
            if (separadorTabela) {
                return;
            }

            if (linhaTabela) {
                tabelaAtual.linhas.push(celulasTabela(linha));
                return;
            }

            fecharTabela();
        }

        if (linhaTabela && ehSeparadorTabela(linhas[index + 1])) {
            fecharParagrafo();
            fecharLista();
            tabelaAtual = {
                cabecalhos: celulasTabela(linha),
                alinhamentos: celulasTabela(linhas[index + 1]).map(classeAlinhamentoTabela),
                linhas: [],
            };
            return;
        }

        const titulo = textoLimpo.match(/^(#{1,3})\s+(.+)$/);
        const itemLista = textoLimpo.match(/^[-*]\s+(.+)$/);
        const itemOrdenado = textoLimpo.match(/^\d+\.\s+(.+)$/);
        const citacao = textoLimpo.match(/^>\s+(.+)$/);

        if (titulo) {
            fecharParagrafo();
            fecharLista();
            fecharTabela();

            const nivel = titulo[1].length;
            const conteudo = renderizarInline(titulo[2], `titulo-${index}`);

            if (nivel === 1) {
                elementos.push(
                    <Title2
                        key={`titulo-${index}`}
                        className="mb-3 break-words text-[28px] leading-tight text-black [overflow-wrap:anywhere]"
                    >
                        {conteudo}
                    </Title2>,
                );
            } else if (nivel === 2) {
                elementos.push(
                    <Title3
                        key={`titulo-${index}`}
                        className="mb-3 break-words text-[22px] leading-tight text-black [overflow-wrap:anywhere]"
                    >
                        {conteudo}
                    </Title3>,
                );
            } else {
                elementos.push(
                    <Title4
                        key={`titulo-${index}`}
                        className="mb-2 break-words text-[18px] leading-tight text-black [overflow-wrap:anywhere]"
                    >
                        {conteudo}
                    </Title4>,
                );
            }
            return;
        }

        if (itemLista || itemOrdenado) {
            fecharParagrafo();
            fecharTabela();

            const tipo = itemOrdenado ? 'ol' : 'ul';

            if (listaAtual?.tipo !== tipo) {
                fecharLista();
                listaAtual = { tipo, itens: [] };
            }

            listaAtual.itens.push(itemOrdenado?.[1] || itemLista?.[1]);
            return;
        }

        if (citacao) {
            fecharParagrafo();
            fecharLista();
            fecharTabela();
            elementos.push(
                <ParagraphLarge
                    key={`quote-${index}`}
                    className="mb-4 border-l-4 border-[var(--color-base)] bg-[var(--cinza-100)] py-2 pl-4 text-[var(--cinza-700)]"
                >
                    {renderizarInline(citacao[1], `quote-${index}`)}
                </ParagraphLarge>,
            );
            return;
        }

        fecharLista();
        fecharTabela();
        paragrafoAtual.push(textoLimpo);
    });

    fecharParagrafo();
    fecharLista();
    fecharTabela();
    fecharBlocoCodigo();

    if (elementos.length === 0) {
        return (
            <ParagraphMedium className="text-[var(--cinza-500)]">{emptyMessage}</ParagraphMedium>
        );
    }

    return <div className="max-w-full min-w-0 overflow-hidden">{elementos}</div>;
}

export default MarkdownRenderer;
