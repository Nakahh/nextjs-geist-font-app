# Documentação do Backend - Siqueira Campos Imóveis

Este documento consolida as principais implementações do backend, incluindo autenticação, envio de emails, geração de PDFs, logging e proteções de segurança. Também inclui sugestões de melhorias incrementais para manutenção e segurança.

---

## 1. Autenticação

### Google OAuth 2.0

- Implementado no arquivo `controllers/authController.js`.
- Utiliza a biblioteca `googleapis` para autenticação via OAuth 2.0.
- O fluxo inclui:
  - Redirecionamento para consentimento Google.
  - Recebimento do código de autorização.
  - Troca do código por tokens de acesso e refresh.
  - Criação ou atualização do usuário no banco de dados.
- Tokens são armazenados e usados para autenticação nas requisições subsequentes.
- Middleware `authMiddleware.js` protege rotas autenticadas.

### Melhorias sugeridas

- Implementar refresh automático do token quando expirar.
- Adicionar logs detalhados para falhas de autenticação.
- Implementar logout seguro invalidando tokens.

---

## 2. Envio de Emails (SMTP com Gmail OAuth2)

- Serviço implementado em `services/emailService.js`.
- Utiliza `nodemailer` com OAuth2 para autenticação segura no Gmail.
- Templates de email são usados para mensagens padronizadas.
- Suporta envio de emails para confirmações, notificações e redefinição de senha.

### Melhorias sugeridas

- Adicionar suporte a templates dinâmicos com handlebars ou similar.
- Implementar fila de envio para evitar bloqueios em picos de envio.
- Monitorar falhas e implementar retry automático.

---

## 3. Geração de PDF

- Serviço implementado em `services/pdfService.js`.
- Utiliza `pdfkit` para criação dinâmica de documentos PDF.
- Usado para gerar documentos como contratos, relatórios e recibos.
- Suporta customização de layout, fontes e imagens.

### Melhorias sugeridas

- Adicionar suporte a geração assíncrona com filas.
- Implementar cache para documentos gerados frequentemente.
- Validar dados de entrada para evitar erros na geração.

---

## 4. Logging de Atividades

- Middleware principal em `middlewares/loggerMiddleware.js`.
- Utiliza `winston` para logging estruturado.
- Logs são salvos em arquivos (`error.log` e `combined.log`) e no banco de dados para rotas críticas e erros.
- Dados sensíveis são mascarados automaticamente.
- Logs incluem informações de requisição, resposta, duração e usuário.
- Também possui logging para requisições lentas e erros não tratados.

### Melhorias implementadas

- Middleware aprimorado em `middlewares/loggerEnhancements.js`.
- Adicionada correlação de IDs para rastreamento.
- Integração com serviço externo de logs (exemplo: Datadog).
- Alertas para erros críticos via webhook.

---

## 5. Proteções de Segurança

- Configuração consolidada em `middlewares/securityMiddleware.js`.
- Utiliza:
  - `helmet` para cabeçalhos HTTP seguros e Content Security Policy (CSP).
  - `cors` configurado para permitir apenas origens confiáveis.
  - `xss-clean` para sanitização contra XSS.
  - `hpp` para proteção contra HTTP Parameter Pollution.
  - Rate limiters para login, criação de conta, reset de senha e API geral.
  - Middleware para blacklist de tokens JWT.
  - Validação de origem e content-type.
  - Proteção contra timing attacks com delays aleatórios.
  - Validação de tamanho máximo do payload.
  - Logging de segurança no banco de dados.
- Middleware combinado `securityMiddleware` aplica todas as proteções.

### Melhorias sugeridas

- Implementar CSRF tokens para rotas sensíveis.
- Revisar e ajustar políticas CSP conforme necessidade.
- Monitorar e bloquear IPs maliciosos automaticamente.
- Adicionar testes automatizados para segurança.

---

## 6. Estrutura do Banco de Dados

- Utiliza Prisma ORM com schema definido em `prisma/schema.prisma`.
- Modelos principais incluem Usuário, Imóvel, Artigo, Visita, Cliente, entre outros.
- Migrations gerenciadas em `prisma/migrations`.
- Recomenda-se manter migrations atualizadas e versionadas.

---

## 7. Testes Automatizados

- Testes unitários e de integração localizados em `backend/tests`.
- Utiliza frameworks como Jest para execução dos testes.
- Scripts para rodar testes disponíveis no `package.json`.
- Cobertura de testes deve ser monitorada e ampliada conforme evolução.

---

## 8. Configuração do Ambiente

- Variáveis de ambiente configuradas via `.env`.
- Configurações sensíveis como chaves de API, credenciais e URLs externas.
- Scripts para setup local em `backend/scripts/setup-local.sh`.
- Documentação para deploy e backup em `backend/scripts`.

---

## 9. Rotas e Contratos da API

- Rotas organizadas em `backend/routes`.
- Cada rota possui controlador correspondente em `backend/controllers`.
- Recomenda-se documentação detalhada das rotas (ex: Swagger ou similar).
- Parâmetros, métodos HTTP e respostas devem ser padronizados.

---

## 10. Exemplos de Uso da API

- Exemplos básicos para autenticação, consulta de imóveis, cadastro de clientes.
- Pode ser incluído em documentação externa ou README do frontend.

---

## 11. Deploy e Monitoramento

- Scripts de deploy em `backend/scripts/deploy.sh`.
- Monitoramento e alertas configurados para erros críticos.
- Logs centralizados via integração externa.
- Recomenda-se CI/CD para automação.

---

## 12. Backup e Recuperação

- Configuração de backups automáticos em `backend/scripts/backup.sh`.
- Monitoramento de backups em `backend/scripts/monitor-backup.sh`.
- Procedimentos para restauração documentados.

---

## 13. Próximos Passos

- Criar documentação para frontend e integração com backend.
- Automatizar deploy com CI/CD.
- Revisar periodicamente dependências para vulnerabilidades.
- Ampliar cobertura de testes.
- Implementar monitoramento avançado e alertas.

---

Esta documentação será mantida atualizada conforme o projeto evolui.

---

**Fim da Documentação**
