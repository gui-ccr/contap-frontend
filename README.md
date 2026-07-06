# 🍕 ContaUp - Frontend (Next.js & Tailwind v4)

Bem-vindo ao repositório Frontend do **ContaUp**, o sistema de gestão contábil inteligente desenhado para pequenos negócios (Pizzarias). Nosso foco é entregar uma experiência visual impecável com as tecnologias mais modernas do ecossistema React.

## 📚 Documentação e Wiki
A documentação técnica detalhada não está mais espalhada por este arquivo! Construímos uma Wiki robusta para documentar a Arquitetura, os Padrões de Código e a Integração com o Backend.

**👉 Acesse a nossa Wiki:**
- [Visão Geral da Arquitetura & Design System](./wiki/01-Visao-Geral.md) (Inclui diagrama visual)
- [Estrutura de Pastas e Padrões (Feature-Sliced)](./wiki/02-Estrutura-e-Padroes.md)
- [Integração com a API, CORS e Tratamento de Erros](./wiki/03-Integracao-API.md)

## 🛠️ Stack Tecnológica

* **Framework**: Next.js 14+ (App Router)
* **Linguagem**: TypeScript
* **Estilização**: Tailwind CSS v4 com nosso próprio Design System MD3
* **Validação**: Zod
* **Chamadas de Rede**: Axios + React Query (via interceptors de Autenticação)
* **Ícones**: Lucide React

## 🚀 Como rodar o projeto

1. **Clone o repositório e acesse a pasta**:
   ```bash
   git clone https://github.com/seu-usuario/conta-ap-frontend.git
   cd conta-ap-frontend
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure o Ambiente**:
   Crie um arquivo `.env.local` na raiz contendo a URL da API (use a URL de produção ou local, conforme necessário):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000` no seu navegador!

---
> Para regras de versão, veja nosso [Fluxo de Git](./fluxo-git.md).