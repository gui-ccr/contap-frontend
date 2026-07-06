# Integração com a API Backend (Gateway)

O Frontend **NUNCA** acessa a rede interna do Backend ou o banco de dados diretamente, exceto para autenticação puramente via provedor em casos específicos. Todo o tráfego de negócio passa pelo API Gateway.

## 1. O Ponto de Contato (Nginx)
A variável de ambiente principal do Frontend é a `NEXT_PUBLIC_API_URL` (ou configurada no arquivo `src/shared/api.ts`).
Essa URL deve apontar EXATAMENTE para o domínio público gerado para o serviço do **Nginx (Railway)** (ex: `https://nginx-production-...up.railway.app`).

Se você tentar apontar para a URL nativa do Node.js, a requisição falhará, pois o Node.js está em uma rede privada.

## 2. Lidando com CORS e Erros
O frontend está configurado para consumir os códigos de status HTTP corretos devolvidos pelo Nginx e pelo Express:

- **200 a 201**: Sucesso. O React Query atualizará os dados locais e exibirá a nova tela.
- **401 Unauthorized**: Ocorre quando o Token JWT expirou ou é inválido. A aplicação deve deslogar o usuário ou tentar fazer o refresh automático.
- **429 Too Many Requests**: Se o usuário tentar enviar ações rápidas demais (DDoS acidental ou malicioso), o Nginx corta a requisição e devolve um 429. O frontend receberá uma falha temporária.
- **Erro de CORS**: Se, por acaso, você rodar a aplicação local (localhost) apontando para a API de Produção, o Backend cortará a conexão devido à política de CORS (que em produção só permite a origem `https://contaup-techbalance.vercel.app`). Em dev, você deve apontar para o servidor de desenvolvimento.

## 3. O Padrão Axios Interceptor
O arquivo `src/shared/api.ts` configura a instância global do `axios`.
Ele possui "interceptors" que escutam a saída de todas as requisições. 
1. Antes da requisição sair, o interceptor verifica se existe um token salvo (no LocalStorage ou via AuthContext) e o injeta automaticamente no cabeçalho `Authorization: Bearer <token>`.
2. Isso nos poupa de ter que escrever manualmente os cabeçalhos em cada nova chamada de API pela aplicação.
