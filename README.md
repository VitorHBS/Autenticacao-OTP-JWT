# Sistema de Autenticação OTP-JWT

## 📋 Visão Geral

Este é um sistema de autenticação robusto usando OTP (One-Time Password) por email e JWT (JSON Web Tokens) para autorização. O sistema foi construído com Node.js, Express, Prisma e PostgreSQL.

## 🔧 Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Verificação**: OTP por Email (via Mailtrap)
- **Validação**: Zod
- **Linguagem**: TypeScript

## 📦 Dependências Principais

```json
{
  "express": "^5.2.1",
  "@prisma/client": "^7.8.0",
  "jsonwebtoken": "^9.0.3",
  "zod": "^4.4.3",
  "mailtrap": "^4.6.0",
  "uuid": "^14.0.0",
  "helmet": "^8.2.0",
  "cors": "^2.8.6"
}
```

## 🗂️ Estrutura do Projeto

```
src/
├── controllers/        # Controladores das rotas
│   ├── auth.ts        # Signin, Signup, UseOTP
│   ├── ping.ts
│   └── private.ts
├── services/          # Lógica de negócio
│   ├── user.ts        # Operações de usuário
│   └── otp.ts         # Geração e validação de OTP
├── libs/              # Bibliotecas utilitárias
│   ├── prisma.ts      # Cliente Prisma
│   ├── jwt.ts         # Criar e verificar JWT
│   ├── mailtrap.ts    # Envio de emails
│   └── rate-limit.ts  # Proteção contra brute force
├── schemas/           # Validação Zod
├── routers/           # Definição de rotas
└── server.ts          # Inicialização do servidor
```

## 🚀 Como Usar

### 1. Instalação

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/otp_auth_db
JWT_SECRET=sua_chave_secreta_super_segura
MAILTRAP_TOKEN=seu_token_mailtrap
MAILTRAP_SENDER_EMAIL=seu_email@mailtrap.io
PORT=3000
NODE_ENV=development
```

### 3. Configurar Banco de Dados

```bash
npx prisma migrate dev
```

### 4. Iniciar o Servidor

```bash
npm run dev
```

## 📡 Endpoints da API

### 1. Sign Up (Cadastro)

**POST** `/auth/signup`

```json
{
  "name": "João Silva",
  "email": "joao@example.com"
}
```

**Resposta (201)**:
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### 2. Sign In (Login)

**POST** `/auth/signin`

```json
{
  "email": "joao@example.com"
}
```

**Resposta (200)**:
```json
{
  "id": "uuid-do-otp"
}
```

O usuário recebe um email com código OTP de 6 dígitos válido por 30 minutos.

### 3. Use OTP (Validar Código)

**POST** `/auth/useotp`

```json
{
  "id": "uuid-do-otp",
  "code": "123456"
}
```

**Resposta (200)**:
```json
{
  "token": "jwt-token-aqui",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### 4. Acessar Rota Protegida

**GET** `/private`

**Headers**:
```
Authorization: Bearer <jwt-token>
```

## 🔒 Recursos de Segurança

### Rate Limiting
- Máximo de 5 tentativas por minuto por rota de autenticação
- Proteção contra brute force
- Limpeza automática de dados expirados

### JWT
- Token expira em 24 horas
- Payload contém apenas o ID do usuário
- Validação de assinatura em todas as rotas protegidas

### OTP
- Código de 6 dígitos gerado aleatoriamente
- Válido por 30 minutos
- Não pode ser reutilizado (marque como usado após validação)
- Cada tentativa requer email válido

### Validação
- Zod para validação de entrada
- Emails únicos
- Mensagens de erro específicas

## 🛠️ Tratamento de Erros

Todos os endpoints retornam erros estruturados:

```json
{
  "error": "Descrição do erro"
}
```

**Status Codes**:
- `400` - Validação falhou
- `401` - Token/Código inválido
- `404` - Usuário não encontrado
- `409` - Email já cadastrado
- `429` - Muitas tentativas (rate limit)
- `500` - Erro interno

## 📊 Modelo de Dados

### User
```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  otps  Otp[]
}
```

### OTP
```prisma
model Otp {
  id        String   @id
  code      String
  userId    Int
  expiresAt DateTime
  used      Boolean  @default(false)
  
  user      User     @relation(fields: [userId], references: [id])
}
```

## 🔄 Fluxo de Autenticação

```
1. Usuário faz Sign Up (nome + email)
   ↓
2. Usuário faz Sign In (email)
   ↓
3. Sistema gera código OTP aleatório
   ↓
4. Email enviado com código
   ↓
5. Usuário faz Use OTP (id + código)
   ↓
6. Sistema valida e marca como usado
   ↓
7. JWT gerado e retornado
   ↓
8. Cliente armazena JWT
   ↓
9. Cliente usa JWT em Authorization header
```

## 📝 Logs

O sistema registra eventos importantes:

```
[AUTH] OTP gerado para usuário email@example.com
[AUTH] Novo usuário criado: email@example.com
[AUTH] Usuário email@example.com autenticado com sucesso
[JWT] Erro ao validar token: jwt expired
```

## ⚙️ Configurações Padrão

- **Expiração JWT**: 24 horas
- **Duração OTP**: 30 minutos
- **Comprimento do Código OTP**: 6 dígitos
- **Rate Limit**: 5 tentativas/minuto por endpoint
- **Limpa cache a cada**: 5 minutos

## 🐛 Troubleshooting

### Erro: "Token não fornecido"
- Certifique-se de incluir `Authorization: Bearer <token>` no header

### Erro: "Código inválido ou expirado"
- Código OTP expira em 30 minutos
- Código só pode ser usado uma vez
- Solicite um novo código fazendo Sign In novamente

### Erro: "Muitas tentativas"
- Você excedeu 5 tentativas em 1 minuto
- Aguarde 1 minuto antes de tentar novamente

### Email não recebido
- Verifique o token do Mailtrap
- Confirme que o email está na whitelist do Mailtrap
- Verifique logs do servidor

## 📈 Melhorias Futuras

- [ ] Refresh tokens para renovação sem fazer login novamente
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 (Google, GitHub)
- [ ] Recuperação de conta
- [ ] Auditoria de logs em banco de dados
- [ ] Cache de sessão em Redis
- [ ] IP whitelist/blacklist
- [ ] Detectar tentativas de login suspeitas

## 📄 Licença

ISC

---

**Última atualização**: 2026-06-09
