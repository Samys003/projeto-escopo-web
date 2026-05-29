import { ArrowLeft, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ParagraphLarge from '../../../components/Typography/ParagraphLarge';
import ParagraphMedium from '../../../components/Typography/ParagraphMedium';
import ParagraphSmall from '../../../components/Typography/ParagraphSmall';
import Title2 from '../../../components/Typography/Title2';

function setoresDisponiveis(documentos) {
    const setores = documentos
        .map((documento) => documento.setor)
        .filter(Boolean)
        .filter((setor, index, lista) => lista.indexOf(setor) === index);

    return setores.length > 0 ? setores : ['Web'];
}

function documentosDoSetor(documentos, setor) {
    const filtrados = documentos.filter((documento) => documento.setor === setor);

    return filtrados.length > 0 ? filtrados : documentos;
}

function criarDestino(documentos, indice, setorPreferido = '') {
    const setores = setoresDisponiveis(documentos);
    const setor = setores.includes(setorPreferido) ? setorPreferido : setores[0];
    const documentosFiltrados = documentosDoSetor(documentos, setor);
    const documento = documentosFiltrados[0] || documentos[0] || null;

    return {
        id: crypto.randomUUID?.() || `${Date.now()}-${indice}`,
        setor,
        documentoId: documento?.id || '',
    };
}

function rotuloDocumento(documentoId, documentos) {
    return (
        documentos.find((documento) => String(documento.id) === String(documentoId))?.titulo || ''
    );
}

function Destino({ destino, indice, documentos, setores, podeRemover, onAlterar, onRemover }) {
    const documentosFiltrados = documentosDoSetor(documentos, destino.setor);

    return (
        <section className="border-t border-[var(--cinza-300)] pt-3 first:border-t-0 first:pt-0">
            <div className="mb-3 flex min-h-8 items-center justify-between gap-3">
                <ParagraphLarge className="font-medium text-[var(--cinza-700)]">
                    Destino {indice + 1}
                </ParagraphLarge>
                {podeRemover && (
                    <button
                        type="button"
                        onClick={() => onRemover(destino.id)}
                        className="flex h-8 w-8 items-center justify-center text-black transition-colors hover:text-[var(--color-alert)]"
                        aria-label={`Remover destino ${indice + 1}`}
                    >
                        <X size={23} strokeWidth={2.2} />
                    </button>
                )}
            </div>

            <label className="mb-6 flex items-center gap-4 pl-7 sm:pl-8">
                <ParagraphLarge as="span" className="text-black">
                    Setor
                </ParagraphLarge>
                <select
                    value={destino.setor}
                    onChange={(event) => {
                        const proximoSetor = event.target.value;
                        const proximoDocumento = documentosDoSetor(documentos, proximoSetor)[0];

                        onAlterar(destino.id, {
                            setor: proximoSetor,
                            documentoId: proximoDocumento?.id || '',
                        });
                    }}
                    className="h-10 rounded-lg border border-[var(--cinza-400)] bg-white px-3 font-inter text-[15px] text-[var(--cinza-700)] outline-none focus:border-[var(--color-base)]"
                >
                    {setores.map((setor) => (
                        <option key={setor} value={setor}>
                            {setor}
                        </option>
                    ))}
                </select>
            </label>

            <div>
                <ParagraphLarge className="mb-2 text-black">Documento:</ParagraphLarge>
                <div className="overflow-hidden rounded-lg border border-black bg-white">
                    {documentosFiltrados.length > 0 ? (
                        documentosFiltrados.map((documento) => {
                            const selecionado =
                                String(documento.id) === String(destino.documentoId);

                            return (
                                <button
                                    key={`${destino.id}-${documento.id}`}
                                    type="button"
                                    onClick={() =>
                                        onAlterar(destino.id, { documentoId: documento.id })
                                    }
                                    className={`block min-h-9 w-full px-3 py-2 text-left font-inter text-[16px] leading-5 transition-colors ${
                                        selecionado
                                            ? 'bg-[var(--roxo-light)] text-[var(--color-base)]'
                                            : 'bg-white text-black hover:bg-[var(--cinza-100)]'
                                    }`}
                                >
                                    {documento.titulo}
                                </button>
                            );
                        })
                    ) : (
                        <ParagraphMedium className="px-3 py-3 text-[var(--cinza-500)]">
                            Nenhum documento disponível.
                        </ParagraphMedium>
                    )}
                </div>
            </div>
        </section>
    );
}

function Sugestao({ trecho, documentos, onFechar, onEnviar }) {
    const documentosNormalizados = useMemo(() => documentos || [], [documentos]);
    const setores = useMemo(
        () => setoresDisponiveis(documentosNormalizados),
        [documentosNormalizados],
    );
    const [destinos, setDestinos] = useState(() => [
        criarDestino(documentosNormalizados, 1, 'Web'),
        criarDestino(documentosNormalizados, 2, 'Mobile'),
    ]);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');

    function alterarDestino(destinoId, alteracoes) {
        setDestinos((destinosAtuais) =>
            destinosAtuais.map((destino) =>
                destino.id === destinoId ? { ...destino, ...alteracoes } : destino,
            ),
        );
    }

    function removerDestino(destinoId) {
        setDestinos((destinosAtuais) =>
            destinosAtuais.length > 1
                ? destinosAtuais.filter((destino) => destino.id !== destinoId)
                : destinosAtuais,
        );
    }

    function adicionarDestino() {
        setDestinos((destinosAtuais) => [
            ...destinosAtuais,
            criarDestino(documentosNormalizados, destinosAtuais.length + 1),
        ]);
    }

    async function enviarSugestao(event) {
        event.preventDefault();

        const destinosValidos = destinos
            .filter((destino) => destino.documentoId)
            .map((destino) => ({
                ...destino,
                documentoTitulo: rotuloDocumento(destino.documentoId, documentosNormalizados),
            }));

        if (destinosValidos.length === 0) {
            setErro('Selecione pelo menos um documento.');
            return;
        }

        try {
            setEnviando(true);
            setErro('');
            await onEnviar(destinosValidos);
            onFechar();
        } catch (error) {
            setErro(error.message || 'Erro ao enviar sugestão.');
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 bg-black/25 lg:left-[280px] xl:left-[356px]"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onFechar();
                }
            }}
        >
            <form
                onSubmit={enviarSugestao}
                className="absolute left-1/2 top-1/2 flex max-h-[calc(100vh-70px)] w-[calc(100%-48px)] max-w-[740px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-[22px] bg-white px-5 py-4 shadow-[var(--external-shadow)] sm:px-7 lg:max-h-[calc(100vh-120px)] lg:px-16 lg:py-5"
            >
                <button
                    type="button"
                    onClick={onFechar}
                    className="mb-3 flex h-8 w-8 items-center justify-center text-black"
                    aria-label="Voltar"
                >
                    <ArrowLeft size={26} strokeWidth={2.2} />
                </button>

                <div className="px-1 sm:px-3">
                    <Title2 className="text-[24px] font-semibold text-black lg:text-[22px]">
                        Criar Sugestão
                    </Title2>
                    <div className="mt-2 border-b-[3px] border-[var(--cinza-300)]" />
                </div>

                <ParagraphSmall className="sr-only">
                    Trecho selecionado para a sugestão: {trecho}
                </ParagraphSmall>

                {erro && (
                    <ParagraphSmall className="mt-3 text-[var(--color-alert)]">
                        {erro}
                    </ParagraphSmall>
                )}

                <div className="mt-3 flex flex-col gap-6 px-1 sm:px-3">
                    {destinos.map((destino, indice) => (
                        <Destino
                            key={destino.id}
                            destino={destino}
                            indice={indice}
                            documentos={documentosNormalizados}
                            setores={setores}
                            podeRemover={destinos.length > 1}
                            onAlterar={alterarDestino}
                            onRemover={removerDestino}
                        />
                    ))}
                </div>

                <div className="mt-7 flex justify-center">
                    <button
                        type="button"
                        onClick={adicionarDestino}
                        className="flex min-h-9 items-center gap-2 rounded-full border-2 border-[var(--color-base)] px-3 py-1 text-[var(--cinza-700)] transition-colors hover:bg-[var(--roxo-light)]"
                    >
                        <Plus size={21} className="text-[var(--color-base)]" />
                        <ParagraphLarge as="span" className="font-medium text-[var(--cinza-700)]">
                            Novo Destino
                        </ParagraphLarge>
                    </button>
                </div>

                <div className="mt-9 flex justify-center">
                    <button
                        type="submit"
                        disabled={enviando}
                        className="rounded-lg bg-[var(--color-base)] px-6 py-3 text-white transition-colors hover:bg-[var(--color-dark)] disabled:opacity-60"
                    >
                        <ParagraphMedium as="span" className="font-semibold text-white">
                            {enviando ? 'Enviando...' : 'Enviar'}
                        </ParagraphMedium>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Sugestao;
