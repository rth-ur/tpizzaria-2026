# 🗄️ Arquitetura de Banco de Dados - TPizzaria

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                    TPizzaria BD                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  DESENVOLVIMENTO          │         PRODUÇÃO            │
│  ───────────────────────────────────────────────────     │
│  JSON Server              │      Supabase PostgreSQL     │
│  (db/db.json)             │      (Cloud Database)        │
│  Porta: 3000              │      Real-time + Auth        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Estrutura de Tabelas

```
tipos_massa
├── id (PRIMARY KEY)
├── descricao (VARCHAR)

status_pedido
├── id (PRIMARY KEY)
├── descricao (VARCHAR)

menu (pizzas)
├── id (PRIMARY KEY)
├── nome (VARCHAR)
├── foto (VARCHAR)
├── descricao (TEXT)
├── valor (DECIMAL)

opcionais (complementos + bebidas)
├── id (PRIMARY KEY)
├── tipo (VARCHAR: 'complemento' | 'bebida')
├── nome (VARCHAR)
├── descricao (TEXT)
├── valor (DECIMAL)

pedidos
├── id (PRIMARY KEY)
├── nome (VARCHAR) - Cliente
├── pizza_id (FK → menu)
├── massa_id (FK → tipos_massa)
├── status_id (FK → status_pedido)
├── complementos (JSONB) - Array
├── bebidas (JSONB) - Array
├── valor_total (DECIMAL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🔄 Fluxo de Dados

```
Usuário
   │
   ├─→ [PedidoComponent.vue]
   │        │
   │        └─→ import apiService
   │              │
   │              ├─→ isDev?
   │              │    ├─ SIM  → JSON Server (http://localhost:3000)
   │              │    └─ NÃO  → Supabase (https://xxx.supabase.co)
   │              │
   │              └─→ POST /pedidos
   │
   ├─→ [ListaPedidoComponent.vue]
   │        │
   │        └─→ setInterval(consultarPedidos, 5000)
   │              │
   │              └─→ GET /pedidos
   │
   └─→ [MenuView.vue]
        │
        └─→ GET /menu
             │
             └─→ Render pizzas
```

---

## 🛠️ Tecnologias

| Fase | Banco | Biblioteca | Conexão |
|------|-------|-----------|---------|
| **Dev** | JSON Server | Node.js | HTTP REST |
| **Prod** | Supabase PostgreSQL | @supabase/supabase-js | HTTPS API |
| **Realtime** | Supabase | - | WebSocket |

---

## 📝 Dados de Teste (db.json)

### tipos_massa
```json
{
  "id": 1,
  "descricao": "Massa Fina"
}
```

### status_pedido
```json
{
  "id": 1,
  "descricao": "Pedido em espera"
}
```

### menu
```json
{
  "id": 1,
  "nome": "Pizza Margherita",
  "foto": "https://via.placeholder.com/300",
  "descricao": "Tomate, mussarela, manjericão",
  "valor": 45.00
}
```

### opcionais
```json
{
  "id": 1,
  "tipo": "complemento",
  "nome": "Borda Recheada de Catupiry",
  "valor": 8.00
}
```

### pedidos
```json
{
  "id": 1,
  "nome": "João",
  "massa": { "id": 1, "descricao": "Massa Fina" },
  "pizza": { "id": 1, "nome": "Pizza Margherita" },
  "complemento": [ { "id": 1, "nome": "Borda Recheada" } ],
  "bebidas": [ { "id": 1, "nome": "Coca Cola" } ],
  "statusId": 5
}
```

---

## 🚀 Scripts de Banco de Dados

### Desenvolvimento
```bash
# Iniciar JSON Server
npm run bancojson

# Resultado
# JSON Server listening at http://localhost:3000
```

### Produção (Supabase)

#### 1. Criar Projeto
```bash
# https://supabase.com
# New Project > tpizzaria
# Settings > API (copiar URL + KEY)
```

#### 2. Executar SQL (Criar Tabelas)
```sql
-- Copiar script de SUPABASE.md
-- Executar em: SQL Editor > New Query
```

#### 3. Configurar .env.production
```env
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_KEY=eyJh...
```

#### 4. Build
```bash
npm run build
# Deploy no Render / GitHub Pages
```

---

## 🔐 Segurança

### JSON Server (Dev)
⚠️ **Sem autenticação** - Apenas para desenvolvimento local

### Supabase (Prod)
✅ **Row Level Security (RLS)** - Políticas de acesso
✅ **JWT Authentication** - Token baseado
✅ **CORS** - Controle de origens
✅ **HTTPS** - Conexão criptografada

---

## 📊 Tamanho de Dados

| Tabela | Registros | Estimado |
|--------|-----------|----------|
| tipos_massa | 4 | < 1 KB |
| status_pedido | 6 | < 1 KB |
| menu | 10+ | ~50 KB |
| opcionais | 20+ | ~50 KB |
| pedidos | Ilimitado | ~100 KB/100 pedidos |
| **Total** | - | **Free Tier Supabase** |

---

## 🔗 Relações (Foreign Keys)

```
pedidos (N) ──┬─→ (1) menu
              ├─→ (1) tipos_massa
              └─→ (1) status_pedido

Onde N pedidos podem referenciar:
- 1 pizza do menu
- 1 tipo de massa
- 1 status
```

---

## 💾 Backup e Restore

### JSON Server
```bash
# Backup manual
cp db/db.json db/db.backup.json

# Restore
cp db/db.backup.json db/db.json
```

### Supabase
✅ Automático (daily backups)
- Settings > Backups > Point-in-time recovery
- Export data: CSV/JSON via Dashboard

---

## 🔄 Transição Dev → Prod

```
1. DESENVOLVIMENTO
   └─ npm run bancojson
      └─ http://localhost:3000

2. BUILD
   └─ npm run build
      └─ Vite compila para PROD

3. VARIÁVEIS DE AMBIENTE
   └─ .env.production configurado
      └─ VITE_SUPABASE_URL + VITE_SUPABASE_KEY

4. DEPLOY
   └─ Render / GitHub Pages
      └─ API chamadas automaticamente apontam para Supabase

5. PRODUÇÃO
   └─ https://seu-app.onrender.com
      └─ Conecta automaticamente a Supabase
```

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| [SUPABASE.md](SUPABASE.md) | Guia detalhado de integração |
| [SUPABASE-QUICKSTART.md](SUPABASE-QUICKSTART.md) | Setup rápido (5-10 min) |
| [DEPLOY.md](DEPLOY.md) | Deploy no Render + GitHub Pages |
| [src/services/apiService.js](src/services/apiService.js) | Serviço unificado JSON/Supabase |

---

## ✅ Checklist BD

- [ ] JSON Server rodando localmente (dev)
- [ ] Supabase projeto criado
- [ ] Credenciais copiadas para `.env.production`
- [ ] Tabelas criadas no Supabase (SQL)
- [ ] Dados de teste inseridos
- [ ] `@supabase/supabase-js` instalado
- [ ] `src/services/apiService.js` criado
- [ ] PedidoComponent usando `apiService`
- [ ] ListaPedidoComponent usando `apiService`
- [ ] Build sem erros
- [ ] Deploy rodando com Supabase

---

**Arquitetura BD pronta para Dev + Prod! 🎉**
