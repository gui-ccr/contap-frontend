export type Campo = {
  nome: string;
  tipo: string;
  obrigatorio: boolean;
  descricao: string;
};

export type ErroInfo = {
  codigo: string;
  quando: string;
};

export type Endpoint = {
  metodo: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  auth: string;
  descricao: string;
  pathParams?: Campo[];
  queryParams?: Campo[];
  body?: Campo[];
  bodyExemplo?: string;
  respostaStatus: string;
  respostaExemplo: string;
  erros: ErroInfo[];
  notas?: string[];
};

export type Modulo = {
  id: string;
  titulo: string;
  icone: React.ReactNode;
  descricao: string;
  endpoints: Endpoint[];
};

// Dados limpos, sem lógica de HTML ou cores embutidas. O React Component cuidará da renderização.
export const MODULOS: Omit<Modulo, "icone">[] = [
  {
    id: "seguranca",
    titulo: "Segurança & DDoS (Nginx)",
    descricao: "Para garantir resiliência contra ataques de força bruta, implementamos um API Gateway na nuvem (Railway) usando Nginx. Ele atua como um Proxy Reverso com Rate Limiting estrito configurado para 5 requisições/segundo por IP.",
    endpoints: [
      {
        metodo: "GET",
        path: "Bloqueio Automático (Rate Limit)",
        auth: "Infraestrutura",
        descricao: "Qualquer tentativa de sobrecarregar a API com múltiplas requisições simultâneas (acima de 10 requests em rajada) será interceptada antes de atingir o servidor Node.js. O Nginx derruba a conexão instantaneamente para economizar CPU/Memória do Backend.",
        respostaStatus: "429 Too Many Requests",
        respostaExemplo: "<html>\n  <head><title>429 Too Many Requests</title></head>\n  <body>\n    <center><h1>429 Too Many Requests</h1></center>\n    <hr><center>nginx</center>\n  </body>\n</html>",
        erros: [
          { codigo: "429 TOO_MANY_REQUESTS", quando: "O IP do cliente excede a taxa de 5 requisições por segundo configurada na limit_req_zone do Nginx." },
        ],
        notas: [
          "Esta é uma camada de infraestrutura (Reverse Proxy) e não uma rota Express. A validação ocorre a nível de rede no Railway.",
          "Protege rotas sensíveis como POST /auth/login contra ataques de dicionário e brute force."
        ]
      }
    ]
  },
  {
    id: "auth",
    titulo: "Autenticação",
    descricao: "Login e cadastro inicial de donos. /login e /registrar-dono são as únicas rotas públicas deste módulo. Cadastro de funcionário (/registrar-usuario) exige token e cargo DONO.",
    endpoints: [
      {
        metodo: "POST",
        path: "/auth/login",
        auth: "Rota Pública",
        descricao: "Autentica via Supabase Auth e retorna o token JWT junto com os dados básicos do usuário.",
        body: [
          { nome: "email", tipo: "string", obrigatorio: true, descricao: "E-mail cadastrado do usuário." },
          { nome: "senha", tipo: "string", obrigatorio: true, descricao: "Senha em texto puro." },
        ],
        bodyExemplo: '{\n  "email": "carlos@acmecorp.com",\n  "senha": "senha123"\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": {\n    "token": "eyJhbGciOiJIUzI1NiIsIn...",\n    "usuario": { "id": "uuid", "nome": "string", "email": "string" }\n  }\n}',
        erros: [
          { codigo: "401 NAO_AUTORIZADO", quando: "Credenciais inválidas, ou usuário autenticado no Supabase Auth mas sem registro correspondente na tabela usuarios." },
          { codigo: "500", quando: "Falha inesperada de comunicação com Supabase/banco." },
        ],
      },
      {
        metodo: "POST",
        path: "/auth/registrar-dono",
        auth: "Rota Pública",
        descricao: "Cria o usuário inicial com cargo DONO, ainda sem empresa vinculada. O fluxo de onboarding completo é: registrar o dono aqui → fazer login → criar a empresa em POST /empresas.",
        body: [
          { nome: "nome", tipo: "string", obrigatorio: true, descricao: "Nome completo. Mínimo 2 caracteres." },
          { nome: "email", tipo: "string", obrigatorio: true, descricao: "E-mail válido (formato verificado por Zod)." },
          { nome: "senha", tipo: "string", obrigatorio: true, descricao: "Mínimo 6 caracteres." },
        ],
        bodyExemplo: '{\n  "nome": "Carlos Gestor",\n  "email": "carlos@acmecorp.com",\n  "senha": "senha123"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Dono registrado com sucesso!"\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Campos ausentes ou fora das regras de validação." },
          { codigo: "409 CONFLITO", quando: "Já existe um usuário com este e-mail." },
        ],
        notas: [
          "A resposta não retorna token — após registrar, o frontend deve chamar POST /auth/login separadamente.",
          "O usuário criado fica sem empresaId. Qualquer chamada autenticada a rotas que dependem de empresa (funcionários, plano de contas, lançamentos etc.) retornará 400 até que POST /empresas seja chamado.",
        ],
      },
      {
        metodo: "POST",
        path: "/auth/registrar-usuario",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Cria um funcionário (cargo definido pelo dono) já vinculado à empresa do usuário autenticado. A empresa é sempre a do dono que faz a chamada — empresa_id não é aceito no body, evitando que um cliente vincule o novo usuário a outra empresa.",
        body: [
          { nome: "nome", tipo: "string", obrigatorio: true, descricao: "Mínimo 2 caracteres." },
          { nome: "email", tipo: "string", obrigatorio: true, descricao: "E-mail válido e único." },
          { nome: "senha", tipo: "string", obrigatorio: true, descricao: "Mínimo 6 caracteres." },
          { nome: "cargo", tipo: "string", obrigatorio: true, descricao: "Cargo do funcionário (nome livre, exceto 'DONO', que é reservado)." },
          { nome: "ativo", tipo: "boolean", obrigatorio: false, descricao: "" },
          { nome: "foto_url", tipo: "string (URL)", obrigatorio: false, descricao: "URL válida da foto de perfil." },
        ],
        bodyExemplo: '{\n  "nome": "Maria Caixa",\n  "email": "maria@acmecorp.com",\n  "senha": "senha123",\n  "cargo": "CAIXA"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Funcionário registrado com sucesso!",\n  "data": { "id": "uuid" }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Campos inválidos no schema Zod." },
          { codigo: "403 NAO_AUTORIZADO", quando: "Usuário autenticado não é DONO, ou não possui empresa vinculada." },
          { codigo: "409 CONFLITO", quando: "E-mail já cadastrado." },
        ],
      },
    ],
  },
  {
    id: "empresas",
    titulo: "Empresas",
    descricao: "CRUD de empresas. Todas as rotas exigem JWT. O acesso é restrito à própria empresa do usuário autenticado: empresaId é sempre derivado do token (nunca de parâmetros da requisição).",
    endpoints: [
      {
        metodo: "POST",
        path: "/empresas",
        auth: "Token JWT Requerido",
        descricao: "Cria a empresa e gera automaticamente um plano de contas padrão com 15 contas (Ativo, Passivo, PL, Receita, Despesa).",
        body: [
          { nome: "nome", tipo: "string", obrigatorio: true, descricao: "Mínimo 2 caracteres." },
          { nome: "nome_fantasia", tipo: "string", obrigatorio: true, descricao: "Mínimo 2 caracteres." },
          { nome: "razao_social", tipo: "string", obrigatorio: true, descricao: "Mínimo 2 caracteres." },
          { nome: "cnpj", tipo: "string", obrigatorio: true, descricao: "Exatamente 14 caracteres/dígitos. Deve ser único." },
        ],
        bodyExemplo: '{\n  "nome": "Acme Corp",\n  "nome_fantasia": "Acme",\n  "razao_social": "Acme Corp Finance Ltda",\n  "cnpj": "12345678000199"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Empresa criada com plano de contas padrao.",\n  "data": {\n    "empresa": { "id": "uuid", "nome": "string", "nome_fantasia": "string", "razao_social": "string", "cnpj": "string" },\n    "plano_contas_padrao": [\n      { "id": "uuid", "empresa_id": "uuid", "codigo": "1.1.01", "nome": "Caixa", "tipo": "ATIVO" }\n    ]\n  }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Campos ausentes ou inválidos." },
          { codigo: "409 CONFLITO", quando: "CNPJ já cadastrado em outra empresa." },
          { codigo: "500 ERRO_BANCO_DE_DADOS", quando: "Falha ao persistir empresa ou plano de contas." },
        ],
        notas: [
          "Contas padrão criadas incluem códigos fixos usados por outras rotas: 1.1.01 (Caixa), 4.1.01 (Receita) e 5.1.01 (Despesa) — essenciais para lançamentos simplificados e baixa de contas a receber.",
        ],
      },
      {
        metodo: "GET",
        path: "/empresas",
        auth: "Token JWT Requerido",
        descricao: "Retorna, em formato de lista, apenas a empresa vinculada ao usuário autenticado (req.usuario.empresaId, derivado do token).",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [\n    { "id": "uuid", "nome": "string", "nome_fantasia": "string", "razao_social": "string", "cnpj": "string" }\n  ]\n}',
        erros: [],
      }
    ],
  },
  {
    id: "funcionarios",
    titulo: "Funcionários",
    descricao: "Gestão de funcionários da empresa do usuário autenticado. Não há endpoint de criação aqui — funcionários são criados via POST /auth/registrar-usuario (exige cargo DONO).",
    endpoints: [
      {
        metodo: "GET",
        path: "/funcionarios",
        auth: "Token JWT Requerido",
        descricao: "Lista os funcionários da empresa do usuário autenticado.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [\n    {\n      "id": "uuid", "nome": "string", "email": "string",\n      "empresa_id": "uuid", "cargo": "GERENTE | CAIXA | DONO",\n      "cpf": "string | undefined", "data_nascimento": "string | undefined",\n      "foto_url": "string | undefined"\n    }\n  ]\n}',
        erros: [{ codigo: "400 ENTRADA_INVALIDA", quando: "Usuário autenticado não possui empresa vinculada." }],
      }
    ],
  },
  {
    id: "plano-contas",
    titulo: "Plano de Contas",
    descricao: "CRUD do plano de contas contábil (Ativo, Passivo, PL, Receita, Despesa) usado nos lançamentos e relatórios.",
    endpoints: [
      {
        metodo: "GET",
        path: "/plano-contas",
        auth: "Token JWT Requerido",
        descricao: "Lista as contas contábeis da empresa do usuário autenticado. Não é possível listar contas de outras empresas.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [ { "id": "uuid", "empresa_id": "uuid", "codigo": "string", "nome": "string", "tipo": "ATIVO" } ]\n}',
        erros: [],
      }
    ]
  },
  {
    id: "lancamentos",
    titulo: "Lançamentos Contábeis",
    descricao: "Registro de lançamentos em partida dobrada.",
    endpoints: [
      {
        metodo: "POST",
        path: "/lancamentos/lancamento",
        auth: "Token JWT Requerido",
        descricao: "Cria um lançamento contábil completo de partida dobrada, com múltiplas partidas de débito/crédito.",
        body: [
          { nome: "empresa_id", tipo: "string (UUID)", obrigatorio: true, descricao: "Exigido pelo schema, porém ignorado pelo controller." },
          { nome: "data_lancamento", tipo: "string/Date", obrigatorio: true, descricao: "Qualquer formato de data parseável pelo JS." },
          { nome: "descricao", tipo: "string", obrigatorio: true, descricao: "Mínimo 5 caracteres." },
          { nome: "tipoTransacao", tipo: "'DEBITO'|'CREDITO'", obrigatorio: true, descricao: "Validado no schema, mas não influencia a lógica deste use case." },
          { nome: "partidas", tipo: "array (mín. 2 itens)", obrigatorio: true, descricao: "Lista de partidas D/C. Cada item: conta_id (UUID), tipo ('D'|'C'), valor (number positivo)." },
        ],
        bodyExemplo: '{\n  "empresa_id": "uuid",\n  "data_lancamento": "2026-06-23",\n  "descricao": "Pagamento de aluguel",\n  "tipoTransacao": "DEBITO",\n  "partidas": [\n    { "conta_id": "uuid-conta-despesa", "tipo": "D", "valor": 800.0 },\n    { "conta_id": "uuid-conta-caixa", "tipo": "C", "valor": 800.0 }\n  ]\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "message": "Lançamento criado com sucesso!",\n  "dados": { "...": "eco do payload validado enviado no body" }\n}',
        erros: [
          { codigo: "401 NAO_AUTORIZADO", quando: "Usuário autenticado não possui empresa vinculada." },
          { codigo: "400 DESEQUILIBRIO_CONTABIL", quando: "Soma dos débitos é diferente da soma dos créditos." },
        ],
      },
      {
        metodo: "GET",
        path: "/lancamentos/lancamentos",
        auth: "Token JWT Requerido",
        descricao: "Lista todos os lançamentos (com suas partidas) da empresa do usuário autenticado.",
        respostaStatus: "200 OK",
        respostaExemplo: '[\n  {\n    "id": "uuid",\n    "empresaId": "uuid",\n    "dataLancamento": "2026-06-01T00:00:00.000Z",\n    "descricao": "string",\n    "partidas": [ { "contaId": "uuid", "tipo": "D", "valor": 100.0 } ]\n  }\n]',
        erros: [{ codigo: "401 NAO_AUTORIZADO", quando: "Usuário sem empresa vinculada." }],
      }
    ],
  },
  {
    id: "contas-receber",
    titulo: "Contas a Receber",
    descricao: "Controle de valores a receber, sempre escopado à empresa do usuário autenticado.",
    endpoints: [
      {
        metodo: "GET",
        path: "/contas-receber",
        auth: "Token JWT Requerido",
        descricao: "Lista as contas a receber da empresa.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [\n    { "id": "uuid", "empresa_id": "uuid", "origem": "string", "valor": 500.0, "data_previsao": "2026-07-01", "recebido": false }\n  ]\n}',
        erros: [],
      }
    ]
  },
  {
    id: "relatorios",
    titulo: "Relatórios",
    descricao: "Relatórios contábeis gerados a partir dos lançamentos e plano de contas: DRE e Balanço Patrimonial.",
    endpoints: [
      {
        metodo: "GET",
        path: "/relatorios/dre",
        auth: "Token JWT Requerido",
        descricao: "Gera a Demonstração do Resultado do Exercício (DRE): receitas e despesas agregadas por conta dentro de um período.",
        queryParams: [
          { nome: "dataInicio", tipo: "string", obrigatorio: true, descricao: "Formato YYYY-MM-DD." },
          { nome: "dataFim", tipo: "string", obrigatorio: true, descricao: "Formato YYYY-MM-DD." },
        ],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": {\n    "empresaId": "uuid",\n    "dataInicio": "2026-06-01T00:00:00.000Z",\n    "dataFim": "2026-06-23T00:00:00.000Z",\n    "receitas": [ { "codigo": "4.1.01", "nome": "Vendas", "saldo": 1500.0 } ],\n    "despesas": [ { "codigo": "5.1.01", "nome": "Aluguel", "saldo": 800.0 } ],\n    "totalReceitas": 1500.0,\n    "totalDespesas": 800.0,\n    "resultadoLiquido": 700.0\n  }\n}',
        erros: [{ codigo: "400 ENTRADA_INVALIDA", quando: "Usuário sem empresa vinculada, ou datas ausentes/inválidas." }],
      }
    ],
  }
];
