function FotoConvidado({ nome, foto }) {
    const gerarIniciais = (nomeCompleto) => {
        return nomeCompleto
            .split(' ')
            .map((parte) => parte[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <>
            {foto ? (
                <img src={foto} alt={nome} className="w-10 h-10 rounded-full object-cover" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-medium">
                    {gerarIniciais(nome)}
                </div>
            )}
        </>
    );
}

export default FotoConvidado;
