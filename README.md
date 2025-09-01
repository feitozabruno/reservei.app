# reservei.app 🚀

Bem-vindo ao repositório do **reservei.app**, uma plataforma de agendamento de serviços construída do zero com o objetivo de criar uma experiência moderna, segura e eficiente tanto para clientes quanto para profissionais.

Este projeto é um "diário de bordo" do meu aprendizado contínuo em desenvolvimento full-stack, com foco em boas práticas de arquitetura, segurança e qualidade de código. O objetivo é construir um produto real e, ao mesmo tempo, criar um portfólio vivo e detalhado.

[![Status do Build](https://img.shields.io/github/actions/workflow/status/feitozabruno/reservei.app/tests.yaml?branch=main)](https://github.com/feitozabruno/reservei.app/actions)
[![Automated Tests](https://github.com/feitozabruno/reservei.app/actions/workflows/tests.yaml/badge.svg)](https://github.com/feitozabruno/reservei.app/actions/workflows/tests.yaml)
[![Licença: MIT](https://img.shields.io/badge/Licença-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Issues Abertas](https://img.shields.io/github/issues/feitozabruno/reservei.app)](https://github.com/feitozabruno/reservei.app/issues)

**[🔗 Acesse a demonstração ao vivo aqui!](https://reservei.app)**

---

## Índice

- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🛠️ Stack de Tecnologia](#️-stack-de-tecnologia)
- [🏛️ Decisões de Arquitetura](#️-decisões-de-arquitetura)
- [🚀 Como Começar (Rodando Localmente)](#-como-começar-rodando-localmente)
- [🧪 Rodando os Testes](#-rodando-os-testes)
- [🤝 Como Contribuir](#-como-contribuir)
- [📄 Licença](#-licença)
- [✍️ Autor](#️-autor)

---

## ✨ Funcionalidades Principais

O `reservei.app` foi projetado para simplificar o agendamento de ponta a ponta.

#### Para Clientes:
- 🔎 **Descoberta:** Encontrar profissionais por especialidade e localização.
- 📅 **Agenda em Tempo Real:** Visualizar apenas os horários realmente livres, sem idas e vindas de mensagens.
- 🖱️ **Agendamento com Um Clique:** Reservar um horário de forma rápida e intuitiva.
- 🔔 **Notificações:** Receber lembretes para não esquecer dos compromissos.

#### Para Profissionais:
- 🌐 **Perfil Público Profissional:** Uma URL personalizada (ex: `reservei.app/@username`) para usar como vitrine digital.
- 🗓️ **Gerenciamento de Disponibilidade:** Definir horários de trabalho recorrentes.
- ⚙️ **Automação:** Permitir que novos agendamentos sejam confirmados automaticamente ou manualmente.
- 📊 **Dashboard:** Visualizar e gerenciar os próximos agendamentos.

---

## 🛠️ Stack de Tecnologia

Este projeto utiliza um conjunto de tecnologias modernas e robustas para garantir performance e uma ótima experiência de desenvolvimento.

* **Backend:**
    * **Framework:** Next.js (App Router)
    * **Linguagem:** JavaScript (Node.js)
    * **Validação de Schema:** Zod
* **Frontend:**
    * **Framework:** Next.js
    * **Linguagem:** JavaScript com React
    * **UI:** Shadcn/ui, Tailwind CSS
* **Banco de Dados:**
    * **Sistema:** PostgreSQL
    * **Migrações:** `node-pg-migrate`
    * **Cliente:** `node-postgres` (pg)
* **DevOps & Testes:**
    * **Ambiente Local:** Docker & Docker Compose
    * **Testes:** Jest para testes de integração
    * **CI/CD:** GitHub Actions
    * **Hospedagem:** Vercel

---

## 🏛️ Decisões de Arquitetura

O design do `reservei.app` foi guiado por decisões estratégicas para garantir um sistema seguro e manutenível.

1.  **Autenticação Stateful:** Optamos por um sistema de sessões armazenadas no banco de dados com **Cookies `HttpOnly`**. Esta abordagem, em detrimento de JWT no `localStorage`, oferece maior segurança contra ataques XSS.

2.  **Autorização em Camadas:** A segurança não está em um único lugar. Usamos um modelo híbrido:
    * **RBAC (Role-Based Access Control):** Um middleware `authorize` protege rotas inteiras com base em papéis (`CLIENT`, `PROFESSIONAL`, `ADMIN`).
    * **Verificação de Posse:** A lógica nos `models` garante que um usuário só possa alterar os recursos que lhe pertencem (ex: seu próprio agendamento).

3.  **Models Especializados (SRP):** A lógica de negócio é dividida em módulos com responsabilidades únicas (`user.js`, `session.js`, `token.js`, `availability.js`, etc.), o que torna o código mais limpo e fácil de testar.

4.  **Validação Centralizada:** Um `validator.js` com **Zod** centraliza todas as validações de entrada da API, garantindo que os `models` recebam apenas dados seguros e bem-formados.

5.  **Ambiente Consistente com Docker:** Todos os serviços de apoio (PostgreSQL, MailCatcher) são gerenciados pelo Docker Compose, garantindo que qualquer desenvolvedor possa rodar o projeto com um único comando.

---

## 🚀 Como Começar (Rodando Localmente)

Siga os passos abaixo para ter o ambiente de desenvolvimento do `reservei.app` rodando na sua máquina.

**1. Pré-requisitos:**
* [Node.js](https://nodejs.org/) (v18 ou superior)
* [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose

**2. Clone o Repositório:**
```bash
git clone [https://github.com/seu-usuario/reservei.app.git](https://github.com/seu-usuario/reservei.app.git)
cd reservei.app
```

**3. Instale as Dependências do Projeto:**
```bash
npm install
```

**4. Inicie a Aplicação:**
```bash
npm run dev
```
Pronto! A aplicação estará disponível em http://localhost:3000 e o MailCatcher (para ver os e-mails de teste) em http://localhost:1080.

## 🧪 Rodando os Testes

Para rodar os testes de integração temos duas opções:

1. Roda os testes em tempo real durante o desenvolvimento.
```bash
npm run test:watch
```

2. Sobe o banco de dados e o servidor web e depois roda os testes.
```bash
npm test
```
---

## 🤝 Como Contribuir

Este é um projeto open-source feito para aprendizado e colaboração. Se você tem ideias, sugestões ou quer ajudar a codificar, sua contribuição é muito bem-vinda!

- Dê uma olhada nas **Issues abertas** para ver o que precisa ser feito.  
- Faça um **fork** do projeto.  
- Crie uma nova branch.  
- Faça o commit das suas alterações seguindo o padrão de **Conventional Commits**.  
- Abra um **Pull Request**.  

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

---

## ✍️ Autor

[Bruno Feitoza]  

- **LinkedIn:** [linkedin.com/in/feitozabruno](https://linkedin.com/in/feitozabruno)  
- **GitHub:** [github.com/feitozabruno](https://github.com/feitozabruno)  


