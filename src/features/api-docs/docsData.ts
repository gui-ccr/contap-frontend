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
      {
        metodo: "GET",
        path: "/auth/me",
        auth: "Token JWT Requerido",
        descricao: "Retorna os dados do usuário autenticado e, se houver, da empresa vinculada.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": {\n    "usuario": { "id": "uuid", "nome": "string", "email": "string", "cargo": "string", "ativo": true, "foto_url": "string | null" },\n    "empresa": { "id": "uuid", "nome": "string", "nome_fantasia": "string", "razao_social": "string", "cnpj": "string" } | null\n  }\n}',
        erros: [{ codigo: "404 NAO_ENCONTRADO", quando: "Usuário autenticado não existe mais na tabela usuarios." }],
      },
      {
        metodo: "GET",
        path: "/auth/sessoes",
        auth: "Token JWT Requerido",
        descricao: "Lista o histórico recente de logins (sessões) do usuário autenticado.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [\n    { "id": "uuid", "device": "Chrome · Windows", "location": "string | \'Desconhecida\'", "time": "string (data)", "status": "ok" }\n  ]\n}',
        erros: [],
      },
      {
        metodo: "POST",
        path: "/auth/sessoes/desconectar-todas",
        auth: "Token JWT Requerido",
        descricao: "Invalida globalmente (Supabase Auth signOut escopo 'global') todos os tokens do usuário, derrubando todas as sessões ativas em qualquer dispositivo.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Todos os dispositivos foram desconectados."\n}',
        erros: [{ codigo: "500", quando: "Token ausente, mal formatado, ou falha ao comunicar com o Supabase Auth." }],
      },
      {
        metodo: "GET",
        path: "/auth/usuarios",
        auth: "Token JWT Requerido",
        descricao: "Lista os usuários da empresa do usuário autenticado, exceto o próprio usuário que faz a chamada.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [\n    { "id": "uuid", "nome": "string", "email": "string", "cargo": "string", "ativo": true, "foto_url": "string | null" }\n  ]\n}',
        erros: [{ codigo: "403", quando: "Usuário autenticado não possui empresa vinculada." }],
      },
      {
        metodo: "PUT",
        path: "/auth/usuarios/:id",
        auth: "Token JWT Requerido",
        descricao: "Atualiza dados de um usuário (nome, cargo, ativo, foto_url), sempre revinculando-o à empresa do usuário autenticado.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "ID do usuário a atualizar." }],
        body: [
          { nome: "nome", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "cargo", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "ativo", tipo: "boolean", obrigatorio: false, descricao: "" },
          { nome: "foto_url", tipo: "string (URL)", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "nome": "Maria Caixa",\n  "ativo": false\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "nome": "string", "email": "string", "cargo": "string", "ativo": true }\n}',
        erros: [
          { codigo: "403", quando: "Usuário autenticado não possui empresa vinculada." },
          { codigo: "404", quando: "Usuário não encontrado." },
        ],
      },
      {
        metodo: "DELETE",
        path: "/auth/usuarios/:id",
        auth: "Token JWT Requerido",
        descricao: "Remove um usuário. Se a query excluirContas=true for enviada, remove também as contas a pagar geradas para ele (ex.: salários).",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "ID do usuário a remover." }],
        queryParams: [{ nome: "excluirContas", tipo: "boolean ('true'|'false')", obrigatorio: false, descricao: "Se 'true', apaga contas a pagar com descrição '[Salário] {nome}' vinculadas ao usuário." }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Usuário removido com sucesso"\n}',
        erros: [
          { codigo: "403", quando: "Usuário autenticado não possui empresa vinculada." },
          { codigo: "404", quando: "Usuário não encontrado." },
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
      },
      {
        metodo: "GET",
        path: "/empresas/:id",
        auth: "Token JWT Requerido",
        descricao: "Busca uma empresa por ID. Só é permitido buscar a própria empresa do usuário autenticado.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "ID da empresa." }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "nome": "string", "nome_fantasia": "string", "razao_social": "string", "cnpj": "string" }\n}',
        erros: [{ codigo: "401 NAO_AUTORIZADO", quando: "O :id da URL não corresponde à empresa vinculada ao usuário autenticado." }],
      },
      {
        metodo: "PUT",
        path: "/empresas/:id",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Atualiza dados cadastrais da própria empresa. Aceita atualização parcial (ao menos um campo).",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "ID da empresa." }],
        body: [
          { nome: "nome", tipo: "string", obrigatorio: false, descricao: "Mínimo 2 caracteres." },
          { nome: "nome_fantasia", tipo: "string", obrigatorio: false, descricao: "Mínimo 2 caracteres." },
          { nome: "razao_social", tipo: "string", obrigatorio: false, descricao: "Mínimo 2 caracteres." },
          { nome: "cnpj", tipo: "string", obrigatorio: false, descricao: "Exatamente 14 caracteres." },
        ],
        bodyExemplo: '{\n  "nome_fantasia": "Acme 2.0"\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "nome": "string", "nome_fantasia": "string", "razao_social": "string", "cnpj": "string" }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Nenhum campo informado, ou campos fora das regras de validação." },
          { codigo: "401 NAO_AUTORIZADO", quando: "O :id da URL não corresponde à empresa do usuário, ou usuário não é DONO." },
        ],
      },
      {
        metodo: "DELETE",
        path: "/empresas/:id",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Remove a própria empresa do usuário autenticado.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "ID da empresa." }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Empresa removida com sucesso.",\n  "data": { "id": "uuid", "nome": "string", "nome_fantasia": "string", "razao_social": "string", "cnpj": "string" }\n}',
        erros: [{ codigo: "401 NAO_AUTORIZADO", quando: "O :id da URL não corresponde à empresa do usuário, ou usuário não é DONO." }],
      }
    ],
  },
  {
    id: "funcionarios",
    titulo: "Funcionários",
    descricao: "Cadastro completo (RH) dos funcionários da empresa do usuário autenticado, incluindo dados salariais, configuração de folha e fechamento mensal de folha de pagamento.",
    endpoints: [
      {
        metodo: "POST",
        path: "/funcionarios",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Cria o cadastro de RH de um funcionário (salário, dia de pagamento, configuração de descontos/benefícios da folha). Distinto de POST /auth/registrar-usuario, que cria as credenciais de login.",
        body: [
          { nome: "nome", tipo: "string", obrigatorio: true, descricao: "Mínimo 2 caracteres." },
          { nome: "email", tipo: "string", obrigatorio: true, descricao: "E-mail válido." },
          { nome: "cargo", tipo: "string", obrigatorio: true, descricao: "" },
          { nome: "cpf_cnpj", tipo: "string", obrigatorio: true, descricao: "Mínimo 11 caracteres." },
          { nome: "salario", tipo: "number", obrigatorio: true, descricao: "Não pode ser negativo." },
          { nome: "dia_pagamento", tipo: "number", obrigatorio: false, descricao: "1 a 31. Padrão 5." },
          { nome: "data_admissao", tipo: "string (data)", obrigatorio: true, descricao: "Data parseável pelo JS." },
          { nome: "config_folha", tipo: "object", obrigatorio: false, descricao: "Configuração de descontos (INSS, FGTS, IRRF) e benefícios (vale transporte, vale refeição, plano de saúde)." },
          { nome: "foto_url", tipo: "string (URL)", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "nome": "Maria Caixa",\n  "email": "maria@acmecorp.com",\n  "cargo": "CAIXA",\n  "cpf_cnpj": "12345678900",\n  "salario": 2500.0,\n  "data_admissao": "2026-01-10"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "status": "success",\n  "data": {\n    "id": "uuid", "empresa_id": "uuid", "nome": "string", "cargo": "string", "email": "string",\n    "cpf_cnpj": "string", "salario": 2500.0, "dia_pagamento": 5, "data_admissao": "string",\n    "config_folha": "object | undefined", "foto_url": "string | undefined"\n  }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Campos ausentes ou fora das regras do schema Zod, ou usuário sem empresa vinculada." },
          { codigo: "403 NAO_AUTORIZADO", quando: "Usuário autenticado não é DONO." },
        ],
      },
      {
        metodo: "GET",
        path: "/funcionarios",
        auth: "Token JWT Requerido",
        descricao: "Lista os funcionários da empresa do usuário autenticado.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [\n    {\n      "id": "uuid", "nome": "string", "email": "string",\n      "empresa_id": "uuid", "cargo": "GERENTE | CAIXA | DONO",\n      "cpf": "string | undefined", "data_nascimento": "string | undefined",\n      "foto_url": "string | undefined"\n    }\n  ]\n}',
        erros: [{ codigo: "400 ENTRADA_INVALIDA", quando: "Usuário autenticado não possui empresa vinculada." }],
      },
      {
        metodo: "POST",
        path: "/funcionarios/folha/fechar",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Fecha a folha de pagamento do mês/ano informado: gera holerites e as respectivas contas a pagar (salário líquido, FGTS, INSS) para todos os funcionários elegíveis da empresa. Idempotente por funcionário/mês/ano — pula quem já tem holerite gerado.",
        body: [
          { nome: "mes", tipo: "number", obrigatorio: true, descricao: "1 a 12." },
          { nome: "ano", tipo: "number", obrigatorio: true, descricao: "Mínimo 2000." },
        ],
        bodyExemplo: '{\n  "mes": 6,\n  "ano": 2026\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "success": true, "count": 3, "message": "Folha fechada com sucesso. 3 holerites gerados." }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Mês fora do intervalo 1-12, ou usuário sem empresa vinculada." },
          { codigo: "403 NAO_AUTORIZADO", quando: "Usuário autenticado não é DONO." },
        ],
        notas: [
          "Cria automaticamente, se ainda não existirem, as contas contábeis 5.1.04 (Despesas com Salários) e 5.1.05 (Impostos s/ Folha).",
        ],
      },
      {
        metodo: "GET",
        path: "/funcionarios/folha/holerites",
        auth: "Token JWT Requerido",
        descricao: "Lista os holerites gerados para a empresa em um mês/ano específico.",
        queryParams: [
          { nome: "mes", tipo: "number", obrigatorio: true, descricao: "1 a 12." },
          { nome: "ano", tipo: "number", obrigatorio: true, descricao: "" },
        ],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [\n    { "id": "uuid", "empresa_id": "uuid", "funcionario_id": "uuid", "mes_referencia": 6, "ano_referencia": 2026, "salario_bruto": 2500.0, "total_descontos": 300.0, "total_acrescimos": 0, "salario_liquido": 2200.0, "detalhes": "object" }\n  ]\n}',
        erros: [{ codigo: "400 ENTRADA_INVALIDA", quando: "Mês ou ano ausentes na query, ou usuário sem empresa vinculada." }],
      },
      {
        metodo: "GET",
        path: "/funcionarios/:id",
        auth: "Token JWT Requerido",
        descricao: "Busca um funcionário por ID, restrito à empresa do usuário autenticado.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "empresa_id": "uuid", "nome": "string", "cargo": "string", "email": "string", "cpf_cnpj": "string", "salario": 2500.0, "dia_pagamento": 5, "data_admissao": "string" }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Usuário sem empresa vinculada." },
          { codigo: "404", quando: "Funcionário não encontrado ou pertence a outra empresa." },
        ],
      },
      {
        metodo: "PUT",
        path: "/funcionarios/:id",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Atualiza o cadastro de RH do funcionário. Aceita atualização parcial.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        body: [
          { nome: "nome", tipo: "string", obrigatorio: false, descricao: "Mínimo 2 caracteres." },
          { nome: "cargo", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "cpf_cnpj", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "salario", tipo: "number", obrigatorio: false, descricao: "" },
          { nome: "dia_pagamento", tipo: "number", obrigatorio: false, descricao: "1 a 31." },
          { nome: "data_admissao", tipo: "string (data)", obrigatorio: false, descricao: "" },
          { nome: "config_folha", tipo: "object", obrigatorio: false, descricao: "" },
          { nome: "foto_url", tipo: "string (URL)", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "salario": 2700.0\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "empresa_id": "uuid", "nome": "string", "cargo": "string", "salario": 2700.0 }\n}',
        erros: [
          { codigo: "403 NAO_AUTORIZADO", quando: "Usuário autenticado não é DONO." },
          { codigo: "404", quando: "Funcionário não encontrado ou pertence a outra empresa." },
        ],
      },
      {
        metodo: "DELETE",
        path: "/funcionarios/:id",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Remove o cadastro de RH do funcionário. Opcionalmente exclui também as contas a pagar de salário associadas.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        queryParams: [{ nome: "excluirContas", tipo: "boolean ('true'|'false')", obrigatorio: false, descricao: "Se 'true', apaga também as contas a pagar geradas para este funcionário." }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Funcionário removido com sucesso.",\n  "data": { "id": "uuid", "nome": "string" }\n}',
        erros: [
          { codigo: "403 NAO_AUTORIZADO", quando: "Usuário autenticado não é DONO." },
          { codigo: "404", quando: "Funcionário não encontrado ou pertence a outra empresa." },
        ],
      }
    ],
  },
  {
    id: "plano-contas",
    titulo: "Plano de Contas",
    descricao: "CRUD do plano de contas contábil (Ativo, Passivo, PL, Receita, Despesa, Custo) usado nos lançamentos e relatórios.",
    endpoints: [
      {
        metodo: "POST",
        path: "/plano-contas",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Cria uma nova conta contábil na empresa do usuário autenticado.",
        body: [
          { nome: "codigo", tipo: "string", obrigatorio: true, descricao: "Código da conta (ex.: '1.1.02')." },
          { nome: "nome", tipo: "string", obrigatorio: true, descricao: "Mínimo 3 caracteres." },
          { nome: "tipo", tipo: "'ATIVO'|'PASSIVO'|'PL'|'RECEITA'|'DESPESA'|'CUSTO'", obrigatorio: true, descricao: "" },
        ],
        bodyExemplo: '{\n  "codigo": "1.1.02",\n  "nome": "Bancos",\n  "tipo": "ATIVO"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Conta contabil criada com sucesso.",\n  "data": { "id": "uuid", "empresa_id": "uuid", "codigo": "string", "nome": "string", "tipo": "ATIVO" }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Campos ausentes ou inválidos no schema Zod." },
          { codigo: "401 NAO_AUTORIZADO", quando: "Usuário sem empresa vinculada." },
        ],
      },
      {
        metodo: "GET",
        path: "/plano-contas",
        auth: "Token JWT Requerido",
        descricao: "Lista as contas contábeis da empresa do usuário autenticado. Não é possível listar contas de outras empresas.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [ { "id": "uuid", "empresa_id": "uuid", "codigo": "string", "nome": "string", "tipo": "ATIVO" } ]\n}',
        erros: [],
      },
      {
        metodo: "GET",
        path: "/plano-contas/:id",
        auth: "Token JWT Requerido",
        descricao: "Busca uma conta contábil por ID, restrita à empresa do usuário autenticado.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "empresa_id": "uuid", "codigo": "string", "nome": "string", "tipo": "ATIVO" }\n}',
        erros: [{ codigo: "401 NAO_AUTORIZADO", quando: "Conta pertence a outra empresa, ou usuário sem empresa vinculada." }],
      },
      {
        metodo: "PUT",
        path: "/plano-contas/:id",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Atualiza uma conta contábil. Aceita atualização parcial (ao menos um campo).",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        body: [
          { nome: "codigo", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "nome", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "tipo", tipo: "'ATIVO'|'PASSIVO'|'PL'|'RECEITA'|'DESPESA'|'CUSTO'", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "nome": "Bancos Conta Movimento"\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "empresa_id": "uuid", "codigo": "string", "nome": "string", "tipo": "ATIVO" }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Nenhum campo informado." },
          { codigo: "401 NAO_AUTORIZADO", quando: "Conta pertence a outra empresa." },
        ],
      },
      {
        metodo: "DELETE",
        path: "/plano-contas/:id",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Remove uma conta contábil da empresa do usuário autenticado.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Conta contabil removida com sucesso.",\n  "data": { "id": "uuid", "empresa_id": "uuid", "codigo": "string", "nome": "string", "tipo": "ATIVO" }\n}',
        erros: [{ codigo: "401 NAO_AUTORIZADO", quando: "Conta pertence a outra empresa." }],
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
      },
      {
        metodo: "POST",
        path: "/lancamentos/lancamento/simplificado",
        auth: "Token JWT Requerido",
        descricao: "Cria um lançamento simplificado de receita ou despesa (o backend monta as partidas D/C automaticamente usando as contas padrão Caixa/Receita/Despesa da empresa, sem exigir conta_id do cliente).",
        body: [
          { nome: "descricao", tipo: "string", obrigatorio: true, descricao: "Mínimo 3 caracteres." },
          { nome: "valor", tipo: "number", obrigatorio: true, descricao: "Positivo." },
          { nome: "tipoTransacao", tipo: "'DEBITO'|'CREDITO'", obrigatorio: true, descricao: "DEBITO gera uma DESPESA, CREDITO gera uma RECEITA." },
          { nome: "data_lancamento", tipo: "string/Date", obrigatorio: true, descricao: "Qualquer formato de data parseável pelo JS." },
        ],
        bodyExemplo: '{\n  "descricao": "Venda balcão",\n  "valor": 250.0,\n  "tipoTransacao": "CREDITO",\n  "data_lancamento": "2026-06-23"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "message": "Lançamento simplificado criado com sucesso!",\n  "dados": { "...": "eco do payload validado enviado no body" }\n}',
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
        metodo: "POST",
        path: "/contas-receber",
        auth: "Token JWT Requerido",
        descricao: "Cria uma conta a receber (nasce sempre como 'recebido: false').",
        body: [
          { nome: "origem", tipo: "string", obrigatorio: true, descricao: "Nome do cliente/origem. Mínimo 2 caracteres." },
          { nome: "valor", tipo: "number", obrigatorio: true, descricao: "Positivo." },
          { nome: "tipo", tipo: "string", obrigatorio: true, descricao: "" },
          { nome: "data_previsao", tipo: "string (data)", obrigatorio: true, descricao: "Formato YYYY-MM-DD." },
        ],
        bodyExemplo: '{\n  "origem": "Cliente XPTO",\n  "valor": 500.0,\n  "tipo": "VENDA",\n  "data_previsao": "2026-07-01"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "id": "uuid", "empresa_id": "uuid", "origem": "string", "valor": 500.0, "tipo": "string", "data_previsao": "2026-07-01", "recebido": false, "data_recebimento": null\n}',
        erros: [{ codigo: "403", quando: "Usuário sem empresa vinculada." }],
      },
      {
        metodo: "GET",
        path: "/contas-receber",
        auth: "Token JWT Requerido",
        descricao: "Lista as contas a receber da empresa.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [\n    { "id": "uuid", "empresa_id": "uuid", "origem": "string", "valor": 500.0, "data_previsao": "2026-07-01", "recebido": false }\n  ]\n}',
        erros: [],
      },
      {
        metodo: "PATCH",
        path: "/contas-receber/:id",
        auth: "Token JWT Requerido",
        descricao: "Recebe/baixa a conta: marca como recebida e gera automaticamente o lançamento contábil de partida dobrada correspondente.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        body: [{ nome: "valor_pago", tipo: "number", obrigatorio: false, descricao: "Valor efetivamente recebido, se diferente do valor previsto." }],
        bodyExemplo: '{\n  "valor_pago": 500.0\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "message": "Conta recebida e lançamento contábil gerado com sucesso!",\n  "dados": { "...": "conta a receber atualizada" }\n}',
        erros: [
          { codigo: "400", quando: "ID da conta ausente na URL." },
          { codigo: "403", quando: "Usuário sem empresa vinculada." },
        ],
      },
      {
        metodo: "PUT",
        path: "/contas-receber/:id",
        auth: "Token JWT Requerido",
        descricao: "Atualiza dados de uma conta a receber ainda não recebida. Não é possível editar uma conta já recebida.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        body: [
          { nome: "origem", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "valor", tipo: "number", obrigatorio: false, descricao: "" },
          { nome: "tipo", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "data_previsao", tipo: "string (data)", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "valor": 550.0\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "id": "uuid", "empresa_id": "uuid", "origem": "string", "valor": 550.0, "recebido": false\n}',
        erros: [
          { codigo: "400", quando: "ID ausente, conta não encontrada, ou conta já recebida." },
          { codigo: "401 NAO_AUTORIZADO", quando: "Conta pertence a outra empresa." },
          { codigo: "403", quando: "Usuário sem empresa vinculada." },
        ],
      }
    ]
  },
  {
    id: "contas-pagar",
    titulo: "Contas a Pagar",
    descricao: "Controle de valores a pagar, sempre escopado à empresa do usuário autenticado. Estrutura análoga a Contas a Receber.",
    endpoints: [
      {
        metodo: "POST",
        path: "/contas-pagar",
        auth: "Token JWT Requerido",
        descricao: "Cria uma conta a pagar (nasce sempre como 'pago: false').",
        body: [
          { nome: "descricao", tipo: "string", obrigatorio: true, descricao: "Mínimo 2 caracteres." },
          { nome: "valor", tipo: "number", obrigatorio: true, descricao: "Positivo." },
          { nome: "tipo", tipo: "string", obrigatorio: true, descricao: "" },
          { nome: "data_vencimento", tipo: "string (data)", obrigatorio: true, descricao: "Formato YYYY-MM-DD." },
        ],
        bodyExemplo: '{\n  "descricao": "Aluguel escritório",\n  "valor": 800.0,\n  "tipo": "DESPESA_FIXA",\n  "data_vencimento": "2026-07-05"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "id": "uuid", "empresa_id": "uuid", "descricao": "string", "valor": 800.0, "tipo": "string", "data_vencimento": "2026-07-05", "pago": false, "data_pagamento": null\n}',
        erros: [{ codigo: "403", quando: "Usuário sem empresa vinculada." }],
      },
      {
        metodo: "GET",
        path: "/contas-pagar",
        auth: "Token JWT Requerido",
        descricao: "Lista as contas a pagar da empresa.",
        respostaStatus: "200 OK",
        respostaExemplo: '[\n  { "id": "uuid", "empresa_id": "uuid", "descricao": "string", "valor": 800.0, "data_vencimento": "2026-07-05", "pago": false }\n]',
        erros: [{ codigo: "403", quando: "Usuário sem empresa vinculada." }],
      },
      {
        metodo: "PATCH",
        path: "/contas-pagar/:id/pagar",
        auth: "Token JWT Requerido",
        descricao: "Paga/baixa a conta: marca como paga e gera automaticamente o lançamento contábil de partida dobrada correspondente.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        body: [{ nome: "valor_pago", tipo: "number", obrigatorio: false, descricao: "Valor efetivamente pago, se diferente do valor previsto." }],
        bodyExemplo: '{\n  "valor_pago": 800.0\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "message": "Conta paga e lançamento contábil gerado!",\n  "dados": { "...": "conta a pagar atualizada" }\n}',
        erros: [
          { codigo: "400", quando: "ID da conta ausente na URL." },
          { codigo: "403", quando: "Usuário sem empresa vinculada." },
        ],
      },
      {
        metodo: "PUT",
        path: "/contas-pagar/:id",
        auth: "Token JWT Requerido",
        descricao: "Atualiza dados de uma conta a pagar ainda não paga. Não é possível editar uma conta já paga.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        body: [
          { nome: "descricao", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "valor", tipo: "number", obrigatorio: false, descricao: "" },
          { nome: "tipo", tipo: "string", obrigatorio: false, descricao: "" },
          { nome: "data_vencimento", tipo: "string (data)", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "valor": 850.0\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "id": "uuid", "empresa_id": "uuid", "descricao": "string", "valor": 850.0, "pago": false\n}',
        erros: [
          { codigo: "400", quando: "ID ausente, conta não encontrada, ou conta já paga." },
          { codigo: "401 NAO_AUTORIZADO", quando: "Conta pertence a outra empresa." },
          { codigo: "403", quando: "Usuário sem empresa vinculada." },
        ],
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
      },
      {
        metodo: "GET",
        path: "/relatorios/balanco-patrimonial",
        auth: "Token JWT Requerido",
        descricao: "Gera o Balanço Patrimonial na data base informada: saldos de Ativo, Passivo e Patrimônio Líquido (incluindo o Lucro/Prejuízo Acumulado do período), com auditoria de que Ativo = Passivo + PL.",
        queryParams: [{ nome: "dataBase", tipo: "string", obrigatorio: true, descricao: "Formato YYYY-MM-DD." }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": {\n    "empresaId": "uuid",\n    "dataBase": "2026-06-23T23:59:59.999Z",\n    "ativos": [ { "codigo": "1.1.01", "nome": "Caixa", "saldo": 3000.0 } ],\n    "passivos": [ { "codigo": "2.1.01", "nome": "Fornecedores", "saldo": 500.0 } ],\n    "patrimonioLiquido": [ { "codigo": "3.9.99", "nome": "Lucro/Prejuízo Acumulado", "saldo": 700.0 } ],\n    "totalAtivo": 3000.0,\n    "totalPassivo": 500.0,\n    "totalPL": 700.0,\n    "equacaoValida": false\n  }\n}',
        erros: [{ codigo: "400 ENTRADA_INVALIDA", quando: "Usuário sem empresa vinculada, ou dataBase ausente/inválida." }],
        notas: [
          "'equacaoValida' compara totalAtivo com (totalPassivo + totalPL) usando igualdade estrita — diferenças de arredondamento podem retornar false mesmo com contabilidade correta.",
        ],
      }
    ],
  },
  {
    id: "dashboard",
    titulo: "Dashboard",
    descricao: "Indicadores agregados para a tela inicial do sistema: resumo financeiro, desempenho mensal, categorias de receita, movimentações recentes, pendências e fluxo de caixa.",
    endpoints: [
      {
        metodo: "GET",
        path: "/dashboard/resumo",
        auth: "Token JWT Requerido",
        descricao: "Retorna um panorama consolidado da empresa no período: resumo financeiro, desempenho mensal anual, receita por categoria, movimentações recentes (últimas 10) e pendências operacionais.",
        queryParams: [
          { nome: "data_inicio", tipo: "string (data)", obrigatorio: false, descricao: "Formato YYYY-MM-DD. Padrão: 30 dias atrás." },
          { nome: "data_fim", tipo: "string (data)", obrigatorio: false, descricao: "Formato YYYY-MM-DD. Padrão: hoje." },
        ],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": {\n    "resumo": "IResumoDashboard",\n    "desempenhoAnual": "IDesempenhoMensal[]",\n    "receitaPorCategoria": "IReceitaCategoria[]",\n    "movimentacoesRecentes": "IMovimentacaoRecente[]",\n    "pendenciasOperacionais": "IPendenciaOperacional[]"\n  }\n}',
        erros: [{ codigo: "400 ENTRADA_INVALIDA", quando: "Usuário sem empresa vinculada, ou datas em formato inválido." }],
      },
      {
        metodo: "GET",
        path: "/dashboard/fluxo-caixa",
        auth: "Token JWT Requerido",
        descricao: "Retorna a série de fluxo de caixa (entradas/saídas) da empresa no período.",
        queryParams: [
          { nome: "data_inicio", tipo: "string (data)", obrigatorio: false, descricao: "Formato YYYY-MM-DD. Padrão: 30 dias atrás." },
          { nome: "data_fim", tipo: "string (data)", obrigatorio: false, descricao: "Formato YYYY-MM-DD. Padrão: hoje." },
        ],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [ { "data": "2026-06-01", "entradas": 1500.0, "saidas": 800.0 } ]\n}',
        erros: [{ codigo: "400 ENTRADA_INVALIDA", quando: "Usuário sem empresa vinculada, ou datas em formato inválido." }],
      }
    ],
  },
  {
    id: "notas-fiscais",
    titulo: "Notas Fiscais",
    descricao: "Anexo e consulta de notas fiscais/comprovantes vinculados a uma conta a pagar ou a receber, sempre escopados à empresa do usuário autenticado.",
    endpoints: [
      {
        metodo: "POST",
        path: "/notas-fiscais",
        auth: "Token JWT Requerido",
        descricao: "Anexa uma nota fiscal a uma conta a pagar ou a receber. Rejeita nome de arquivo ou número de nota duplicados na mesma empresa.",
        body: [
          { nome: "tipo_referencia", tipo: "'conta_pagar'|'conta_receber'", obrigatorio: true, descricao: "" },
          { nome: "referencia_id", tipo: "string (UUID)", obrigatorio: true, descricao: "ID da conta a pagar/receber referenciada." },
          { nome: "arquivo_url", tipo: "string (URL)", obrigatorio: true, descricao: "" },
          { nome: "arquivo_nome", tipo: "string", obrigatorio: true, descricao: "Deve ser único na empresa." },
          { nome: "numero_nota", tipo: "string", obrigatorio: false, descricao: "Se informado, deve ser único na empresa." },
          { nome: "emitida_em", tipo: "string (data)", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "tipo_referencia": "conta_pagar",\n  "referencia_id": "uuid",\n  "arquivo_url": "https://.../nota.pdf",\n  "arquivo_nome": "nota-123.pdf",\n  "numero_nota": "123"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "id": "uuid", "empresa_id": "uuid", "tipo_referencia": "conta_pagar", "referencia_id": "uuid",\n  "numero_nota": "string | null", "arquivo_url": "string", "arquivo_nome": "string", "emitida_em": "string | null"\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "arquivo_url/arquivo_nome ausentes, tipo_referencia inválido, ou nome/número de nota já cadastrado." },
        ],
      },
      {
        metodo: "GET",
        path: "/notas-fiscais",
        auth: "Token JWT Requerido",
        descricao: "Lista todas as notas fiscais da empresa do usuário autenticado.",
        respostaStatus: "200 OK",
        respostaExemplo: '[\n  { "id": "uuid", "empresa_id": "uuid", "tipo_referencia": "conta_pagar", "referencia_id": "uuid", "arquivo_url": "string", "arquivo_nome": "string" }\n]',
        erros: [],
      },
      {
        metodo: "GET",
        path: "/notas-fiscais/referencia/:referencia_id",
        auth: "Token JWT Requerido",
        descricao: "Lista as notas fiscais anexadas a uma conta a pagar/receber específica.",
        pathParams: [{ nome: "referencia_id", tipo: "string (UUID)", obrigatorio: true, descricao: "ID da conta a pagar/receber." }],
        respostaStatus: "200 OK",
        respostaExemplo: '[\n  { "id": "uuid", "empresa_id": "uuid", "tipo_referencia": "conta_receber", "referencia_id": "uuid", "arquivo_url": "string", "arquivo_nome": "string" }\n]',
        erros: [{ codigo: "401 NAO_AUTORIZADO", quando: "Alguma nota encontrada pertence a outra empresa (checagem de segurança contra referencia_id de outro tenant)." }],
      },
      {
        metodo: "DELETE",
        path: "/notas-fiscais/:id",
        auth: "Token JWT Requerido",
        descricao: "Remove uma nota fiscal da empresa do usuário autenticado.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        respostaStatus: "204 No Content",
        respostaExemplo: "(corpo vazio)",
        erros: [
          { codigo: "401 NAO_AUTORIZADO", quando: "Nota pertence a outra empresa." },
          { codigo: "404", quando: "Nota fiscal não encontrada." },
        ],
      }
    ],
  },
  {
    id: "cargos",
    titulo: "Cargos",
    descricao: "Cadastro de cargos personalizados usados pela empresa (distintos do cargo de sistema DONO/CAIXA/GERENTE do usuário).",
    endpoints: [
      {
        metodo: "POST",
        path: "/cargos",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Cria um novo cargo para a empresa do usuário autenticado.",
        body: [
          { nome: "nome", tipo: "string", obrigatorio: true, descricao: "Mínimo 2 caracteres." },
          { nome: "descricao", tipo: "string", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "nome": "Supervisor de Caixa",\n  "descricao": "Responsável por conferir fechamentos de caixa"\n}',
        respostaStatus: "201 Created",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "empresa_id": "uuid", "nome": "string", "descricao": "string | undefined" }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Nome ausente ou com menos de 2 caracteres." },
          { codigo: "403", quando: "Usuário sem empresa vinculada." },
        ],
      },
      {
        metodo: "GET",
        path: "/cargos",
        auth: "Token JWT Requerido",
        descricao: "Lista os cargos cadastrados na empresa do usuário autenticado.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": [ { "id": "uuid", "empresa_id": "uuid", "nome": "string", "descricao": "string | undefined" } ]\n}',
        erros: [{ codigo: "403", quando: "Usuário sem empresa vinculada." }],
      },
      {
        metodo: "PUT",
        path: "/cargos/:id",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Atualiza nome e/ou descrição de um cargo da empresa.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        body: [
          { nome: "nome", tipo: "string", obrigatorio: false, descricao: "Mínimo 2 caracteres." },
          { nome: "descricao", tipo: "string", obrigatorio: false, descricao: "" },
        ],
        bodyExemplo: '{\n  "nome": "Supervisor Sênior"\n}',
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "data": { "id": "uuid", "empresa_id": "uuid", "nome": "string", "descricao": "string | undefined" }\n}',
        erros: [
          { codigo: "400 ENTRADA_INVALIDA", quando: "Nome informado com menos de 2 caracteres." },
          { codigo: "403", quando: "Usuário sem empresa vinculada." },
          { codigo: "404 NAO_ENCONTRADO", quando: "Cargo não encontrado." },
          { codigo: "401 NAO_AUTORIZADO", quando: "Cargo pertence a outra empresa." },
        ],
      },
      {
        metodo: "DELETE",
        path: "/cargos/:id",
        auth: "Token JWT Requerido (cargo DONO)",
        descricao: "Remove um cargo da empresa do usuário autenticado.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "status": "success",\n  "message": "Cargo deletado com sucesso."\n}',
        erros: [
          { codigo: "403", quando: "Usuário sem empresa vinculada." },
          { codigo: "404 NAO_ENCONTRADO", quando: "Cargo não encontrado." },
          { codigo: "401 NAO_AUTORIZADO", quando: "Cargo pertence a outra empresa." },
        ],
      }
    ],
  },
  {
    id: "notificacoes",
    titulo: "Notificações",
    descricao: "Notificações internas do sistema para a empresa do usuário autenticado.",
    endpoints: [
      {
        metodo: "GET",
        path: "/notificacoes",
        auth: "Token JWT Requerido",
        descricao: "Lista as notificações da empresa e a contagem de não lidas.",
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "notificacoes": [\n    { "id": "uuid", "titulo": "string", "mensagem": "string", "lida": false, "data_criacao": "string" }\n  ],\n  "naoLidas": 3\n}',
        erros: [{ codigo: "403", quando: "Usuário sem empresa vinculada." }],
      },
      {
        metodo: "PATCH",
        path: "/notificacoes/:id/lida",
        auth: "Token JWT Requerido",
        descricao: "Marca uma notificação da empresa como lida.",
        pathParams: [{ nome: "id", tipo: "string (UUID)", obrigatorio: true, descricao: "" }],
        respostaStatus: "200 OK",
        respostaExemplo: '{\n  "id": "uuid",\n  "titulo": "string",\n  "lida": true\n}',
        erros: [
          { codigo: "400", quando: "Notificação não encontrada (ou pertence a outra empresa)." },
          { codigo: "403", quando: "Usuário sem empresa vinculada." },
        ],
      }
    ],
  }
];
