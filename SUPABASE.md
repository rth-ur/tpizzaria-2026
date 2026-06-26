# 🚀 Integração Supabase - TPizzaria

## 📊 O que é Supabase?

**Supabase** é um backend open-source que fornece:
- ✅ PostgreSQL (banco de dados relacional)
- ✅ Autenticação (login/registro)
- ✅ APIs REST/GraphQL automáticas
- ✅ Real-time (atualizações em tempo real)
- ✅ Storage (arquivos)
- ✅ Grátis até 500MB de dados

---

## 🔧 Setup Supabase

### 1. Criar Conta e Projeto

1. Ir para [supabase.com](https://supabase.com)
2. Clicar em "Sign Up"
3. Criar conta (GitHub, Google ou email)
4. Criar novo projeto:
   - **Project Name**: `tpizzaria`
   - **Password**: Salve com segurança
   - **Region**: Escolha mais próximo (ex: `us-east-1`)
   - **Pricing**: Free plan

### 2. Copiar Credenciais

Na página do projeto, vá para **Settings > API**:
- Copie: **Project URL** (ex: `https://xxxx.supabase.co`)
- Copie: **anon public key** (ex: `eyJh...`)

Salve em `.env.production`:
```env
VUE_APP_SUPABASE_URL=https://xxxx.supabase.co
VUE_APP_SUPABASE_KEY=eyJh...
```

---

## 📋 Criar Tabelas no Supabase

### 1. Acessar Supabase Dashboard

1. Ir para [app.supabase.com](https://app.supabase.com)
2. Abrir seu projeto `tpizzaria`
3. No menu esquerdo, clicar em **SQL Editor**

### 2. Executar SQL para criar tabelas

Copie e cole este script no SQL Editor:

```sql
-- Tabela: tipos_massa
CREATE TABLE tipos_massa (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  descricao VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: status_pedido
CREATE TABLE status_pedido (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  descricao VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: opcionais (complementos + bebidas)
CREATE TABLE opcionais (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tipo VARCHAR(50) NOT NULL, -- 'complemento' ou 'bebida'
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  valor DECIMAL(10, 2) NOT NULL,
  eh_novidade BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: menu (pizzas)
CREATE TABLE menu (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  foto VARCHAR(500),
  descricao TEXT,
  valor DECIMAL(10, 2),
  eh_novidade BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela: pedidos
CREATE TABLE pedidos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  pizza_id BIGINT REFERENCES menu(id),
  massa_id BIGINT REFERENCES tipos_massa(id),
  status_id BIGINT REFERENCES status_pedido(id) DEFAULT 5,
  complementos JSONB, -- Array de IDs dos complementos
  bebidas JSONB, -- Array de IDs das bebidas
  valor_total DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Clicar em **Run** para executar.

### 3. Inserir Dados de Teste

```sql
-- Inserir tipos de massa
INSERT INTO tipos_massa (descricao) VALUES
('Massa Fina'),
('Massa Grossa'),
('Massa de Fermentação Natural'),
('Borda Recheada');

-- Inserir status de pedidos
INSERT INTO status_pedido (descricao) VALUES
('Pedido em espera'),
('Em produção'),
('A caminho'),
('Entregue'),
('Pedido pendente'),
('Pedido realizado');

-- Inserir opcionais (complementos)
INSERT INTO opcionais (tipo, nome, descricao, valor) VALUES
('complemento', 'Borda Recheada de Catupiry', 'Borda generosa recheada com catupiry cremoso', 8.00),
('complemento', 'Adicional de Queijo', 'Queijo mussarela extra por cima da pizza', 5.00),
('complemento', 'Fatia Extra', 'Uma fatia a mais da pizza escolhida', 12.00),
('complemento', 'Azeitonas', 'Azeitonas frescas', 3.00);

-- Inserir opcionais (bebidas)
INSERT INTO opcionais (tipo, nome, descricao, valor) VALUES
('bebida', 'Coca Cola Lata 310 ml', '', 6.00),
('bebida', 'Guaraná Antarctica 310 ml', '', 6.00),
('bebida', 'Água Mineral 500 ml', '', 4.00),
('bebida', 'Suco Natural Laranja', '', 8.00);

-- Inserir pizzas (menu)
INSERT INTO menu (nome, descricao, valor, foto) VALUES
('Pizza Margherita', 'Tomate, mussarela, manjericão', 45.00, 'https://via.placeholder.com/300'),
('Pizza Pepperoni', 'Pepperoni e mussarela', 48.00, 'https://via.placeholder.com/300'),
('Pizza Vegetariana', 'Legumes variados', 42.00, 'https://via.placeholder.com/300'),
('Pizza Especial da Casa', 'Frango, bacon, catupiry', 52.00, 'https://via.placeholder.com/300');
```

---

## 💻 Integrar no Vue 3

### 1. Instalar Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Criar arquivo `src/services/supabaseClient.js`

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 3. Atualizar `main.js`

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Configurar URL de API global
const isDev = import.meta.env.MODE === 'development'
const apiUrl = isDev 
  ? 'http://localhost:3000'
  : import.meta.env.VITE_SUPABASE_URL

app.config.globalProperties.$apiUrl = apiUrl
app.config.globalProperties.$isDev = isDev

app.use(router)
app.mount('#app')
```

### 4. Atualizar PedidoComponent.vue

**Antes (JSON Server):**
```javascript
async getTiposMassa() {
  const response = await fetch(`${this.$apiUrl}/tipos_massa`);
  this.listaTiposMassa = await response.json();
}
```

**Depois (Supabase):**
```javascript
import { supabase } from '@/services/supabaseClient'

async getTiposMassa() {
  if (this.$isDev) {
    // Desenvolvimento: usar JSON Server
    const response = await fetch(`${this.$apiUrl}/tipos_massa`)
    this.listaTiposMassa = await response.json()
  } else {
    // Produção: usar Supabase
    const { data, error } = await supabase
      .from('tipos_massa')
      .select('*')
    if (error) console.error('Erro:', error)
    else this.listaTiposMassa = data
  }
}
```

### 5. Criar Serviço Unificado (Recomendado)

Arquivo `src/services/apiService.js`:

```javascript
import { supabase } from './supabaseClient'

const isDev = import.meta.env.MODE === 'development'
const API_URL = isDev ? 'http://localhost:3000' : null

// Função auxiliar para fetch/Supabase
async function fetchData(endpoint) {
  if (isDev) {
    // JSON Server
    const res = await fetch(`${API_URL}/${endpoint}`)
    return res.json()
  } else {
    // Supabase
    const { data, error } = await supabase
      .from(endpoint)
      .select('*')
    if (error) throw new Error(error.message)
    return data
  }
}

async function createData(endpoint, payload) {
  if (isDev) {
    // JSON Server
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    return res.json()
  } else {
    // Supabase
    const { data, error } = await supabase
      .from(endpoint)
      .insert([payload])
    if (error) throw new Error(error.message)
    return data
  }
}

async function deleteData(endpoint, id) {
  if (isDev) {
    // JSON Server
    const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
      method: 'DELETE'
    })
    return res.ok
  } else {
    // Supabase
    const { error } = await supabase
      .from(endpoint)
      .delete()
      .eq('id', id)
    if (error) throw new Error(error.message)
    return true
  }
}

export { fetchData, createData, deleteData }
```

Usar nos componentes:

```javascript
import { fetchData, createData } from '@/services/apiService'

async getTiposMassa() {
  try {
    this.listaTiposMassa = await fetchData('tipos_massa')
  } catch (error) {
    console.error('Erro:', error)
  }
}

async criarPedido() {
  try {
    await createData('pedidos', dadosPedido)
    this.adicionarAlerta('Pedido criado!', 'sucesso')
  } catch (error) {
    this.adicionarAlerta('Erro: ' + error.message, 'erro')
  }
}
```

---

## 🔑 Variáveis de Ambiente

### `.env.development`
```env
VITE_SUPABASE_URL=http://localhost:3000
VITE_SUPABASE_KEY=dev
```

### `.env.production`
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=eyJhbGc...sua-chave-pública
```

---

## 🔐 RLS (Row Level Security) - Segurança

No Supabase Dashboard, para cada tabela em **Authentication > Policies**:

### Exemplo: Política para `pedidos` (Pública - Leitura)

```sql
CREATE POLICY "Pedidos - SELECT"
ON pedidos
FOR SELECT
USING (true);

CREATE POLICY "Pedidos - INSERT"
ON pedidos
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Pedidos - UPDATE"
ON pedidos
FOR UPDATE
USING (true);

CREATE POLICY "Pedidos - DELETE"
ON pedidos
FOR DELETE
USING (true);
```

**Nota**: Para produção, implemente autenticação adequada (login/JWT).

---

## 🚀 Deploy com Supabase

### Passo 1: Build Local
```bash
npm run build
```

### Passo 2: Configurar `.env.production`
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=eyJhbGc...
VUE_APP_API_BASE_URL=https://seu-projeto.supabase.co
```

### Passo 3: Deploy no Render/GitHub Pages

**GitHub Pages:**
```bash
git add .
git commit -m "Integração Supabase"
git push origin main
```

**Render:**
1. Conectar repositório
2. Build: `npm run build`
3. Environment variables no Render dashboard
4. Deploy

---

## ✅ Checklist de Integração

- [ ] Conta Supabase criada
- [ ] Projeto `tpizzaria` criado
- [ ] Credenciais copiadas para `.env.production`
- [ ] Tabelas criadas (SQL executado)
- [ ] Dados de teste inseridos
- [ ] `@supabase/supabase-js` instalado
- [ ] `supabaseClient.js` criado
- [ ] `apiService.js` criado
- [ ] Componentes atualizados
- [ ] `.env.production` configurado
- [ ] Build compila sem erros
- [ ] Deploy realizado

---

## 🆘 Troubleshooting

### ❌ "CORS Error"
**Solução**: No Supabase Settings > API, habilitar CORS:
```
http://localhost:3000
https://seu-dominio.com
```

### ❌ "401 Unauthorized"
**Solução**: Verificar se a chave pública está correta em `.env.production`

### ❌ "Table not found"
**Solução**: 
1. Verificar nome exato da tabela no Supabase
2. Executar SQL novamente se necessário

### ❌ "Fetch not defined"
**Solução**: Usar `import.meta.env` ao invés de `process.env`

---

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Vue 3 + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-vue-3)

---

**Supabase configurado e pronto para produção! 🎉**
