# Projeto Escopo - Web

<img src="./src/assets/logotipo-desktop.svg" alt="Logotipo Escopo">

Frontend da plataforma de levantamento de requisitos, Escopo, desenvolvido como Trabalho de Conclusão de Curso (TCC) no curso de Desenvolvimento de Sistemas no SENAI.

A aplicação web é responsável por fornecer a interface de interação com os usuários, permitindo o gerenciamento de projetos e o acesso às funcionalidades da plataforma de forma centralizada e intuitiva.

## Sobre o projeto

O sistema foi desenvolvido com o objetivo de centralizar todo o levantamento de requisitos de projetos, permitindo:

- Autenticação de usuários
- Gerenciamento de projetos
- Criação, edição e versionamento de documentos
- Criação de registros
- Documentação de reuniões entre o time e clientes

Este repositório contém exclusivamente o frontend da aplicação.

## Tecnologias utilizadas

- React
- JavaScript
- Vite
- React Router DOM
- React Hook Forms
- Tailwind CSS

## Estrutura de pastas

```txt
src/
├── assets/       -- Arquivos estáticos utilizados pela aplicação
├── components/   -- Componentes reutilizáveis
├── hooks/        -- Hooks customizados
├── pages/        -- Páginas da aplicação
├── services/     -- Integração com a API e serviços externos
├── utils/        -- Funções auxiliares reutilizadas
```

## Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js 22.15.0+
- npm 10.9.2+

Também é necessário que a API esteja em execução.

## Como executar o projeto

### 1. Executar a API localmente (opcional)

Para utilizar o frontend em ambiente local com todas as funcionalidades disponíveis, é necessário executar também a API do projeto.

Siga as instruções disponíveis no repositório do backend:

https://github.com/zNathan2303/projeto-escopo-api

Caso prefira utilizar uma API já hospedada, basta configurar a variável VITE_API_URL com a URL correspondente.

### 2. Clonar o repositório

```bash
git clone https://github.com/Samys003/projeto-escopo-web
```

### 3. Entrar na pasta do projeto

```bash
cd projeto-escopo-web
```

### 4. Instalar dependências

```bash
npm i
```

### 5. Configurar variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

```env
VITE_API_URL=http://localhost:8080
```

Caso esteja utilizando a API hospedada, substitua pela URL correspondente.

### 6. Iniciar aplicação

```bash
npm run dev
```

Aplicação disponível em:

```txt
http://localhost:5173
```

## Funcionalidades

- Login e autenticação de usuários
- Visualização e gerenciamento de projetos
- Controle de acesso baseado em permissões
- Gerenciamento de documentos
- Registro de informações do projeto
- Organização e acompanhamento de reuniões

## Convenções do projeto

- Commits seguindo Conventional Commits
- Componentização visando reutilização de código
- Organização das responsabilidades por pastas
- Consumo da API centralizado na camada de serviços

## Repositórios relacionados

Backend:

- https://github.com/zNathan2303/projeto-escopo-api

Banco de dados:

- https://github.com/EdvanOAlves/projeto-escopo-db

Aplicação Mobile:

- https://github.com/AndreRT77/projeto-escopo-mobile

## Equipe

- [Nathan](https://www.linkedin.com/in/nathandasilvacosta/) - Back-end e Mobile
- [Edvan](https://www.linkedin.com/in/edvan-alves/) - Banco de dados e Front-end
- [Samara](https://www.linkedin.com/in/samara-santos-b92160397/) - Front-end
- [André](https://www.linkedin.com/in/andr%C3%A9-roberto-tavares-03a36b316/) - Mobile e Front-end
