# 🚀 Quick Start - Supabase para TPizzaria

## ⏱️ Tempo: 5-10 minutos

---

## 1️⃣ Criar Projeto Supabase (2 min)

```bash
# Ir para https://supabase.com
# 1. Sign Up / Login
# 2. New Project > tpizzaria
# 3. Password (salve!)
# 4. Region: us-east-1 (ou próximo)
# 5. Create Project (aguarde ~2 min)
```

---

## 2️⃣ Copiar Credenciais (1 min)

Na página do projeto:
1. **Settings > API**
2. Copiar:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_KEY`

Exemplo:
```
URL:  https://abc123xyz.supabase.co
KEY:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 3️⃣ Configurar Variáveis (1 min)

Criar arquivo `.env.production`:

```env
VITE_SUPABASE_URL=https://abc123xyz.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VUE_APP_API_BASE_URL=https://abc123xyz.supabase.co
```

---

## 4️⃣ Criar Tabelas (2-3 min)

No Supabase Dashboard:

### Opção A: SQL Editor (Rápido)

1. **SQL Editor** (menu esquerdo)
2. Cole este código:

```sql
-- Tabela: tipos_massa
CREATE TABLE tipos_massa (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  descricao VARCHAR(255) NOT NULL
);

-- Tabela: status_pedido
CREATE TABLE status_pedido (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  descricao VARCHAR(255) NOT NULL
);

-- Tabela: menu (pizzas)
CREATE TABLE menu (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  foto VARCHAR(500),
  descricao TEXT,
  valor DECIMAL(10, 2)
);

-- Tabela: opcionais (complementos + bebidas)
CREATE TABLE opcionais (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tipo VARCHAR(50) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10, 2)
);

-- Tabela: pedidos
CREATE TABLE pedidos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  pizza_id BIGINT REFERENCES menu(id),
  massa_id BIGINT REFERENCES tipos_massa(id),
  status_id BIGINT REFERENCES status_pedido(id),
  complementos JSONB,
  bebidas JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Clicar **Run**

### Opção B: Table View (UI)

1. **Tables** (menu esquerdo)
2. **New table** para cada: tipos_massa, status_pedido, menu, opcionais, pedidos
3. Adicionar colunas manualmente

---

## 5️⃣ Inserir Dados de Teste (1-2 min)

No SQL Editor, copiar e executar:

```sql
-- Tipos de massa
INSERT INTO tipos_massa (descricao) VALUES
('Massa Fina'),
('Massa Grossa'),
('Massa de Fermentação Natural');

-- Status
INSERT INTO status_pedido (descricao) VALUES
('Pedido em espera'),
('Em produção'),
('A caminho'),
('Entregue');

-- Menu
INSERT INTO menu (nome, descricao, valor, foto) VALUES
('Pizza Margherita', 'Tomate, mussarela, manjericão', 45.00, 'https://via.placeholder.com/300'),
('Pizza Pepperoni', 'Pepperoni e mussarela', 48.00, 'https://via.placeholder.com/300');

-- Opcionais
INSERT INTO opcionais (tipo, nome, valor) VALUES
('complemento', 'Borda Recheada de Catupiry', 8.00),
('bebida', 'Coca Cola Lata', 6.00);
```

---

## 6️⃣ Instalar Dependência (1 min)

```bash
cd "Projeto Final/tpizzaria"
npm install @supabase/supabase-js
```

---

## 7️⃣ Testar Build (2 min)

```bash
npm run build
```

Deve compilar sem erros ✅

---

## ✅ Pronto!

Supabase está configurado e pronto para:
- ✅ Desenvolvimento local (JSON Server)
- ✅ Produção (Supabase PostgreSQL)

---

## 🔗 Links Úteis

| Recurso | Link |
|---------|------|
| Dashboard Supabase | https://app.supabase.com |
| Seu Projeto | https://abc123xyz.supabase.co |
| Docs | https://supabase.com/docs |
| Guia Completo | [SUPABASE.md](SUPABASE.md) |

---

## 📝 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Table not found" | Verificar nome exato (case-sensitive) |
| "401 Unauthorized" | Copiar chave correta de Settings > API |
| "CORS Error" | Habilitar em Settings > API > CORS |
| "npm install falha" | Deletar node_modules: `rm -rf node_modules && npm install` |

---

**Pronto para Supabase! 🎉**
