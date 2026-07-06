# Visão Geral do Frontend (ContaUp)

Bem-vindo à documentação oficial do repositório Frontend do projeto ContaUp.
Esta aplicação é a interface gráfica (Client-Side) responsável por entregar a experiência ao usuário final, consumindo as APIs REST protegidas do nosso Backend.

## 🎯 Objetivo
Prover uma interface rápida, responsiva e alinhada com as melhores práticas de UI/UX para a gestão contábil (Contas a Pagar/Receber, Balanços, DRE e Funcionários).

## 🛠️ Stack Tecnológica

### Core
- **Framework**: Next.js 14+ (Utilizando o moderno App Router `src/app`)
- **Linguagem**: TypeScript
- **Gerenciador de Pacotes**: npm

### UI & Design System
- **Estilização**: Tailwind CSS v4
- **Sistema de Design**: Inspirado no Material Design 3 (MD3) com tokens personalizados (definidos em `globals.css`).
- **Ícones**: Lucide React / Untitled UI Icons
- **Animações**: GSAP (GreenSock) para transições fluidas e micro-interações de alto padrão.
- **Componentes Acessíveis**: React Aria Components

### Gerenciamento de Dados e Estado
- **Requisições API**: Axios (com interceptors para injetar JWT)
- **Gerenciamento de Estado de Servidor**: React Query (@tanstack/react-query)
- **Validação de Formulários**: Zod

### Segurança e Auth
- **BaaS**: Integração direta com `@supabase/supabase-js` em casos pontuais, mas primariamente agindo através de chamadas seguras para a API Node.js.

---
Leia os demais arquivos desta Wiki para entender como padronizamos nossos componentes e como nos comunicamos com a API!
