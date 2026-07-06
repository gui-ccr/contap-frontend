# Arquitetura, Pastas e Design System

A arquitetura do Frontend do ContaUp foi estruturada utilizando a abordagem **Feature-Sliced Design (adaptada)**.
Isso significa que, em vez de agruparmos arquivos pelo tipo (todos os controllers juntos, todas as views juntas), nós agrupamos por **Funcionalidade (Feature)**.

## 1. Estrutura de Pastas (`src/`)

- `app/`: Contém as rotas da aplicação (Next.js App Router). Aqui ficam os arquivos `page.tsx` e `layout.tsx`.
- `features/`: O coração do sistema. Cada módulo de negócio tem sua própria pasta (Ex: `auth`, `contas`, `funcionarios`, `dashboard`). Dentro de cada feature, ficam os componentes, hooks e tipos específicos daquele contexto.
- `ui/`: Nossa biblioteca de componentes burros/visuais (O **Design System**). Componentes aqui não podem saber nada sobre regras de negócio. Ex: `Button`, `Modal`, `TextInput`.
- `shared/`: Código utilitário compartilhado globalmente por toda a aplicação (Configurações do Axios, Contextos de Autenticação globais, Helpers de data).
- `hooks/`: Hooks customizados globais.
- `layout/`: Componentes estruturais da página (Sidebar, Header da aplicação).

## 2. Design System (Tailwind v4)

O visual do ContaUp é guiado por uma paleta de design centralizada (inspirada no Material Design 3 e estética Glassmorphism).
Não utilizamos classes de cores fixas soltas pelo código (ex: `bg-[#131313]`).

Toda a definição de Tokens de UI ocorre em `src/app/globals.css`, através de variáveis CSS integradas ao novo motor do Tailwind v4:

### Tokens Disponíveis
- **Cores de Superfície**: `--color-surface`, `--color-background`, `--color-surface-container`
- **Cores Primárias (Ações principais)**: `--color-primary`
- **Tipografia**: O sistema padroniza os tamanhos de fonte em classes semânticas. Ex: `.text-headline-xl`, `.text-body-md`, `.text-label-sm`.

**Regra de Ouro**: Sempre construa componentes usando as variáveis do Tailwind (ex: `bg-[var(--color-surface)]` ou configurando aliases se necessário), para garantir que a UI fique totalmente consistente.
