# DominioNerd List

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Badge">
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify Badge">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase Badge">
</p>

## Sobre o Projeto

O DominioNerd List é uma aplicação web completa, desenvolvida em **ReactJS**, projetada para gerenciar e visualizar uma lista dinâmica de itens relacionados ao universo nerd. Seja para acompanhar coleções, listar desejos ou organizar informações sobre jogos, filmes, séries, quadrinhos e mais, esta ferramenta oferece uma interface intuitiva e persistência de dados real.

Este projeto foca em uma experiência de usuário fluida e responsiva, utilizando os princípios do React para criar componentes reutilizáveis e uma arquitetura de aplicação eficiente. A integração com o **Supabase** permite o armazenamento e a recuperação de dados em tempo real, transformando o DominioNerd List em uma ferramenta poderosa e escalável para seus hobbies.

## Funcionalidades

* **Listagem de Itens Persistente:** Visualize todos os itens da sua lista, armazenados de forma segura no banco de dados do Supabase.
* **Adição de Novos Itens:** Adicione facilmente novos elementos à sua coleção ou lista de desejos, com os dados sendo salvos instantaneamente no backend.
* **Edição e Remoção:** Gerencie seus itens com opções simples de edição e exclusão, com todas as mudanças refletidas no Supabase.
* **Detalhes do Item:** (Se aplicável) Veja informações mais detalhadas sobre cada item.
* **Autenticação (Se aplicável):** (Se você planeja adicionar, mencione aqui, ex: "Gerenciamento de usuários para listas personalizadas.")
* **Filtragem/Pesquisa:** (Se aplicável) Encontre rapidamente o que você procura dentro da sua lista persistente.

## Tecnologias Utilizadas

* **ReactJS:** Biblioteca JavaScript para construção de interfaces de usuário.
* **React Router DOM:** Para gerenciamento de rotas e navegação na aplicação.
* **Supabase:** Backend de código aberto, fornecendo:
    * **Banco de Dados PostgreSQL:** Para armazenamento de dados relacional.
    * **Autenticação:** (Se usado) Para gerenciar usuários e sessões.
    * **APIs Instantâneas:** Para interagir com o banco de dados de forma simples via cliente.
* **Netlify:** Plataforma de hospedagem e CI/CD para o deploy contínuo da aplicação.
* **CSS Modules (ou outro método de estilização, se aplicável):** Para estilização modular e evitar conflitos de escopo.
* **Hooks (useState, useEffect, useContext, useReducer, etc.):** Para gerenciamento de estado e ciclo de vida dos componentes.

## Como Executar o Projeto Localmente

Siga estas instruções para configurar e rodar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* Uma conta e projeto configurado no [Supabase](https://supabase.com/)

### Configuração do Supabase

1.  **Crie um Projeto no Supabase:** Acesse o site do Supabase e crie um novo projeto.
2.  **Obtenha as Credenciais:** No seu painel do Supabase, vá em `Project Settings` > `API` e copie o `Project URL` e a `anon public` `Service Role Key`.
3.  **Variáveis de Ambiente:** Crie um arquivo `.env` na raiz do seu projeto (junto ao `package.json`) e adicione suas credenciais do Supabase:

    ```
    REACT_APP_SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE
    REACT_APP_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC_SUPABASE
    ```
    *Lembre-se de nunca commitar seu arquivo `.env` para o Git.*

4.  **Configuração do Banco de Dados:** (Se você tiver um esquema SQL ou instruções para configurar as tabelas no Supabase, adicione-as aqui.)

### Instalação

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/MarcioBADias/dominioNerd-list.git](https://github.com/MarcioBADias/dominioNerd-list.git)
    ```
2.  **Navegue até o Diretório do Projeto:**
    ```bash
    cd dominioNerd-list
    ```
3.  **Instale as Dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

### Executando a Aplicação

1.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm start
    # ou
    yarn start
    ```
    Isso abrirá a aplicação no seu navegador padrão em `http://localhost:3000`.

## Estrutura do Projeto

A estrutura do projeto segue as convenções comuns de aplicações React, com componentes, lógica e estilos organizados para modularidade e fácil manutenção.
