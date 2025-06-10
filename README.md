# reservei.app

Aplicativo de agendamento online para reservar horários com profissionais.

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Testes](#testes)
- [Scripts Úteis](#scripts-úteis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Contribuição](#contribuição)

---

## Sobre o Projeto

O **reservei.app** é uma aplicação web para agendamento online, conectando profissionais a clientes de forma simples e eficiente. O projeto está em desenvolvimento e já conta com endpoints de status, migrações e inscrição em lista de espera.

## Funcionalidades

- Página inicial "coming soon" com formulário para inscrição em lista de e-mails.
- API RESTful com endpoints para:
  - Status do sistema e do banco de dados (`/api/v1/status`)
  - Gerenciamento de migrações do banco (`/api/v1/migrations`)
  - Inscrição em lista de espera (`/api/v1/subscribe`)
- Validação robusta de dados e tratamento centralizado de erros.
- Testes de integração automatizados com Jest.
- Middleware global para validação de rotas e métodos permitidos.

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate)
- [Jest](https://jestjs.io/) para testes
- [Docker Compose](https://docs.docker.com/compose/) para ambiente de desenvolvimento

## Como Rodar Localmente

1. **Pré-requisitos:**

   - Node.js (versão definida em `.nvmrc`)
   - Docker e Docker Compose

2. **Clone o repositório:**

   ```bash
   git clone github.com/feitozabruno/reservei.app
   cd reservei.app
   ```

3. **Configure as variáveis de ambiente:**

   - Copie o arquivo `.env.development` e ajuste conforme necessário.

4. **Inicie a aplicação:**

   ```bash
   npm run dev
   ```

5. **Acesse:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3000/api/v1/"endpoint"](http://localhost:3000/api/v1/status)

## Testes

- Para rodar os testes de integração:
  ```bash
  npm run test:watch
  ```
- Os testes estão localizados em `tests/integration/api/v1/`.

## Scripts Úteis

- `npm run dev` — Sobe a aplicação em modo desenvolvimento
- `npm test` — Executa os testes de integração
- `npm run migrations:create` — Cria uma nova migration
- `npm run migrations:up` — Executa as migrations pendentes
- `npm run services:up` — Sobe os serviços Docker
- `npm run services:down` — Para e remove os serviços Docker
- `npm run lint:prettier:check` — Checa formatação com Prettier
- `npm run lint:eslint:check` — Checa lint com ESLint

## Estrutura de Pastas

```
app/                # Frontend e rotas de API (Next.js)
infra/              # Infraestrutura, banco, migrations, scripts
models/             # Lógica de domínio e integração
middleware.js       # Middleware global de rotas/métodos
package.json        # Dependências e scripts
README.md           # Este arquivo
...
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b minha-feature`)
3. Commit suas alterações (`git commit -m 'feat: minha feature'`)
4. Push para a branch (`git push origin minha-feature`)
5. Abra um Pull Request

---

MIT License
