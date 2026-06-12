import { API_URL, getUserByEmail } from '../services/api';

function pegar(objeto, campos, fallback = '') {
    for (const campo of campos) {
        const valor = objeto?.[campo];

        if (valor !== undefined && valor !== null && valor !== '') {
            return valor;
        }
    }

    return fallback;
}

export function normalizarFotoPerfil(foto) {
    if (foto === undefined || foto === null) {
        return '';
    }

    const valor = String(foto).trim();

    if (!valor) {
        return '';
    }

    if (/^(data:image\/|blob:|https?:\/\/)/i.test(valor)) {
        return valor;
    }

    if (valor.startsWith('//')) {
        return `${window.location.protocol}${valor}`;
    }

    if (/^[A-Za-z0-9+/]+=*$/.test(valor) && valor.length > 120) {
        return `data:image/jpeg;base64,${valor}`;
    }

    if (valor.startsWith('/')) {
        return `${API_URL}${valor}`;
    }

    return `${API_URL}/${valor.replace(/^\.?\//, '')}`;
}

export function dadosUsuarioResposta(resposta) {
    const candidatos = [
        resposta?.usuario,
        resposta?.user,
        resposta?.data?.usuario,
        resposta?.data?.user,
        resposta?.data,
        resposta,
    ];

    return (
        candidatos.find(
            (valor) => valor && typeof valor === 'object' && !Array.isArray(valor),
        ) || {}
    );
}

export function extrairFotoPerfil(resposta, fallback = '') {
    const candidatos = [
        resposta?.foto_perfil,
        resposta?.fotoPerfil,
        resposta?.foto,
        resposta?.avatar,
        resposta?.profile_picture,
        resposta?.profilePicture,
        resposta?.usuario?.foto_perfil,
        resposta?.usuario?.fotoPerfil,
        resposta?.usuario?.foto,
        resposta?.usuario?.avatar,
        resposta?.user?.foto_perfil,
        resposta?.user?.fotoPerfil,
        resposta?.user?.foto,
        resposta?.user?.avatar,
        resposta?.data?.foto_perfil,
        resposta?.data?.fotoPerfil,
        resposta?.data?.foto,
        resposta?.data?.avatar,
        resposta?.data?.usuario?.foto_perfil,
        resposta?.data?.usuario?.fotoPerfil,
        resposta?.data?.usuario?.foto,
        resposta?.data?.usuario?.avatar,
        resposta?.data?.user?.foto_perfil,
        resposta?.data?.user?.fotoPerfil,
        resposta?.data?.user?.foto,
        resposta?.data?.user?.avatar,
    ];
    const foto = candidatos.find((valor) => valor !== undefined && valor !== null && valor !== '');

    return normalizarFotoPerfil(foto || fallback);
}

export function lerUsuarioAutenticado() {
    try {
        return JSON.parse(localStorage.getItem('authUser') || '{}') || {};
    } catch {
        return {};
    }
}

export function salvarUsuarioAutenticado(usuario) {
    localStorage.setItem('authUser', JSON.stringify(usuario));
    window.dispatchEvent(new CustomEvent('authUserUpdated', { detail: usuario }));
}

export async function carregarUsuarioAutenticadoAtualizado() {
    const usuarioLocal = lerUsuarioAutenticado();
    const email = pegar(usuarioLocal, ['email', 'email_usuario', 'emailUsuario'], '');

    if (!email) {
        return usuarioLocal;
    }

    try {
        const resposta = await getUserByEmail(email);
        const usuarioApi = dadosUsuarioResposta(resposta);
        const foto = extrairFotoPerfil(usuarioApi, extrairFotoPerfil(usuarioLocal));
        const usuarioAtualizado = {
            ...usuarioLocal,
            ...usuarioApi,
            ...(foto && { foto_perfil: foto, fotoPerfil: foto }),
        };

        salvarUsuarioAutenticado(usuarioAtualizado);

        return usuarioAtualizado;
    } catch {
        return usuarioLocal;
    }
}
