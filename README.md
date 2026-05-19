# 🍕 ContaAp - Gestão Contábil e Financeira

Este é o braço de Frontend do **ContaAp**, um software especializado na gestão contábil para o setor de alimentação (Pizzarias). O objetivo é transformar a complexidade da contabilidade em uma interface intuitiva e eficiente.

---

## 🛠️ Tecnologias Escolhidas (Stack)

Selecionamos ferramentas que equilibram a velocidade de entrega com a qualidade de nível sênior:

* **Next.js 14+**: Nosso framework principal. Ele permite criar páginas que carregam instantaneamente e facilita a conexão com o banco de dados.
* **TailwindCSS**: Ferramenta de estilização. Com ele, garantimos que o sistema seja "Mobile First", funcionando perfeitamente em celulares e computadores.
* **Shadcn/UI**: Uma biblioteca de componentes prontos (botões, tabelas, modais). Isso nos poupa tempo de design e garante que o site seja visualmente padronizado.
* **TypeScript**: Uma camada de segurança para o nosso código, ajudando a identificar erros antes mesmo de rodarmos a aplicação.
* **Zod**: Responsável por validar os dados que entram no sistema, garantindo que um valor financeiro seja sempre um número e não um texto, por exemplo.

---

## 🚀 Como rodar o projeto

Siga estes passos simples para configurar o ambiente de desenvolvimento:

1.  **Pré-requisitos**: Tenha o **Node.js** instalado em sua máquina.
2.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/seu-usuario/conta-ap-frontend.git](https://github.com/seu-usuario/conta-ap-frontend.git)
    ```
3.  **Instale as dependências**:
    ```bash
    npm install
    ```
4.  **Inicie o servidor local**:
    ```bash
    npm run dev
    ```
5.  **Acesse no navegador**: Abra `http://localhost:3000`.

---

## 📋 Escopo das Funcionalidades (Frontend)

Com base nos requisitos contábeis, nossa interface entregará:

1.  **Dashboard Financeiro**: Visualização de saldos de Caixa/Bancos e índices de liquidez.
2.  **Gestão de Lançamentos**: Tela para registrar entradas (Débito) e saídas (Crédito) com validação automática de balanceamento.
3.  **Plano de Contas**: Listagem e cadastro de contas estruturadas (Ativo, Passivo, PL, Receita, Despesa).
4.  **Relatórios Contábeis**: Geração visual do Balanço Patrimonial e da Demonstração de Resultado (DRE).

---

## 📐 Princípios de Desenvolvimento (SOLID & Clean Code)

Para mantermos o código organizado mesmo sendo um projeto em grupo, seguiremos estas regras:

* **S (Single Responsibility)**: Cada componente deve cuidar de apenas uma parte da tela.
* **DRY (Don't Repeat Yourself)**: Se você está copiando e colando código, ele provavelmente deveria ser um componente reutilizável.
* **Clean Code**: Use nomes de variáveis em inglês ou português que sejam claros (Ex: `const saldoTotal = 0` em vez de `const s = 0`).

---

## 📐 Organização inicial sugerida
```
src/
├── app/              # Roteamento do Next.js (páginas)
├── components/       # Componentes globais e comuns (botões, inputs do Shadcn)
├── core/             # Regras de negócio puras (Entidades e Casos de Uso - Clean Arch)
├── features/         # O coração do app dividido por funcionalidades
│   ├── accounting/   # Lançamentos, Balanço, DRE
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── auth/         # Login e Cadastro
│   └── dashboard/    # Gráficos e Resumos
├── hooks/            # Lógicas reutilizáveis do React
├── lib/              # Configurações de bibliotecas externas (ex: prisma, axios)
└── utils/            # Funções auxiliares simples (formatação de moeda, datas)
```

---

Dica: Se você for criar algo novo, pergunte-se: "Isso pertence a uma funcionalidade específica (ex: Contabilidade) ou é algo que todo o sistema usa (ex: um botão de fechar)?". Se for específico, vai para features/.


## 🔄 Fluxo de Trabalho (Git Workflow)

Para mantermos nosso código organizado e evitarmos conflitos, siga este passo a passo básico sempre que for iniciar o seu dia de trabalho ou finalizar uma tarefa.

### 0. O Primeiro Passo (Apenas na primeira vez)
Para baixar o projeto para a sua máquina, abra o terminal na pasta onde deseja guardar o código e rode o comando de clone. Depois, entre na pasta do projeto:
```bash
git clone https://github.com/seu-usuario/projeto.git
cd 'nome do projeto'
```

### 1. Atualize seu código local (Antes de começar)
Sempre puxe as atualizações que a sua equipe fez antes de começar a escrever código novo. Isso evita dores de cabeça no futuro.
```bash
git pull origin main
```

### 2. Verifique o estado do projeto
Use este comando a qualquer momento para ver quais arquivos você criou, modificou ou deletou.
```bash
git status
```

### 3. Prepare os arquivos (Staging Area)
Escolha quais arquivos modificados você quer colocar na "caixa" para enviar.
```bash
# Adiciona um arquivo específico (Recomendado)
git add src/caminho/do/arquivo.ts

# Adiciona TODOS os arquivos modificados de uma vez
git add .
```
### 4. Feche a caixa e coloque uma etiqueta (Commit)
Salve as alterações na sua máquina criando um histórico. Seja claro na mensagem para que os outros desenvolvedores entendam o que foi feito.
```bash
git commit -m "feat: adiciona controller de login do usuario"
```
---
> Dica: Use feat: para novas funcionalidades, fix: para correção de bugs e chore: para configurações gerais.

#### 5. Envie para a nuvem (Push)
Agora que o código está salvo localmente, envie para o repositório remoto para que a equipe possa testar e integrar.
```bash
git push origin main
```