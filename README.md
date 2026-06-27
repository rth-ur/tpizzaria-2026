https://tpizzaria-2026.vercel.app/
https://github.com/rth-ur/tpizzaria-2026
https://api-tpizzaria.onrender.com

# 🍕 TPizzaria - Aplicação de Pedidos de Pizza

## 📋 Sobre o Projeto

**TPizzaria** é uma aplicação Vue 3 para gestão de pedidos de pizzas artesanais. Permite que clientes selecionem pizzas, personalizem com complementos e bebidas, e acompanhem o status dos pedidos em tempo real.

### Segmento
- **Restaurante / Pizzaria**: Gestão de pedidos e acompanhamento em tempo real
- **Público-alvo**: Clientes e staff da pizzaria

---

## ✨ Mudanças Implementadas

### 1. **Validação + Alertas Semânticos**

#### Campos Obrigatórios
- ✅ **Nome**: Mínimo 3 caracteres
- ✅ **Tipo de Massa**: Seleção obrigatória
- ✅ **Bloqueio de Envio**: Botão desabilitado enquanto campos inválidos

#### Sistema de Alertas com Cores
- 🔴 **Erro** (`#c0392b`) - Validação falha, erros de conexão
- 🟢 **Sucesso** (`#27ae60`) - Pedido confirmado
- 🟠 **Aviso** (`#f39c12`) - Avisos gerais
- 🔵 **Info** (`#3498db`) - Informações

```vue
<!-- Exemplo: Sistema de Alertas -->
<div v-if="alertas.length > 0" class="alerts-container" >
  <div
    v-for="(alerta, idx) in alertas"
    :key="idx"
    :class="['alerta', `alerta-${alerta.tipo}`]"
  >
    {{ alerta.mensagem }}
  </div>
</div>
```

### 2. **Lógica de Validação**

```javascript
// Validar Nome
validarNome() {
  if (!this.nomeCliente.trim()) {
    this.erros.nome = "Nome é obrigatório";
  } else if (this.nomeCliente.trim().length < 3) {
    this.erros.nome = "Nome deve ter pelo menos 3 caracteres";
  } else {
    this.erros.nome = null;
  }
}

// Validar Massa
validarMassa() {
  if (!this.tipoMassaSelecionado) {
    this.erros.massa = "Tipo de massa é obrigatório";
  } else {
    this.erros.massa = null;
  }
}

// Propriedade Computada: Botão só ativo se tudo válido
computed: {
  podeEnviar() {
    return this.nomeCliente.trim() !== "" && this.tipoMassaSelecionado !== "";
  }
}
```

### 3. **UX - Fluxo Completo**

#### a) Criação de Pedido
1. Cliente preenche nome e seleciona tipo de massa
2. Sistema valida em tempo real (`@blur`, `@change`)
3. Adiciona complementos e bebidas (opcionais)
4. Clica "Confirmar Pedido"
5. ✅ Alerta de sucesso aparece
6. **→ Redireciona automaticamente para listagem de pedidos (1.5s)**

```javascript
// Redirecionamento após confirmar
if (req.ok) {
  this.adicionarAlerta("Pedido confirmado com sucesso!", "sucesso");
  // ... limpar form ...
  setTimeout(() => {
    this.$router.push("/pedidos");  // ← Redirecionamento
  }, 1500);
}
```

#### b) Listagem em Tempo Real
- **Polling automático a cada 5 segundos**
- Atualiza lista de pedidos sem recarregar a página
- Exibe número do pedido, nome do cliente, pizza, massa, opcionais, status e ações

```javascript
// Polling automático
iniciarPolling() {
  this.pollingInterval = setInterval(() => {
    this.consultarPedidos();
  }, 5000);  // A cada 5 segundos
}

// Limpar polling ao desmontar componente
beforeUnmount() {
  this.pararPolling();
}
```

#### c) Exclusão com Re-Render Imediato
- Confirma antes de deletar
- Remove pedido da lista **imediatamente** (sem esperar polling)
- Atualiza visualmente sem reload

```javascript
async deletarPedido(idPedido) {
  if (confirm("Deseja deletar este pedido?")) {
    const response = await fetch(`${this.$apiUrl}/pedidos/${idPedido}`, {
      method: "DELETE",
    });
    if (response.ok) {
      // Re-renderiza imediatamente
      this.listaPedidosRealizados = this.listaPedidosRealizados.filter(
        (p) => p.id !== idPedido
      );
    }
  }
}
```

---

## 🛠️ Stack Técnico

- **Frontend**: Vue 3 + Vue Router
- **Backend**: JSON Server (desenvolvimento) / Render (produção)
- **Estilo**: CSS Scoped com cores semânticas
- **Validação**: Vue Computed Properties + Methods

---

## 📦 Estrutura de Arquivos

```
tpizzaria/
├── public/
│   ├── img/
│   │   ├── banner.png
│   │   └── logo.png
│   └── index.html
├── src/
│   ├── assets/
│   │   ├── banner.png
│   │   ├── logo_tpizzaria.png
│   │   └── icone_lixeira.png
│   ├── components/
│   │   ├── BannerComponent.vue
│   │   ├── NavBarComponent.vue
│   │   ├── PedidoComponent.vue       ← Validação + Alertas
│   │   └── ListaPedidoComponent.vue  ← Polling + Exclusão
│   ├── views/
│   │   ├── MenuView.vue
│   │   ├── ConfiguracaoPedidoView.vue
│   │   └── PedidosView.vue
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── db/
│   └── db.json                       ← Base de dados JSON
├── package.json
└── README.md
```

---

## 🚀 Deploy

### Opção 1: GitHub Pages (Frontend)

1. **Fazer Fork do Repositório**
   ```bash
   git clone https://github.com/seu-usuario/Modelo-para-trabalho-de-dev-web.git
   cd "Projeto Final/tpizzaria"
   ```

2. **Build para Produção**
   ```bash
   npm run build
   ```

3. **Fazer Deploy no GitHub Pages**
   - Vá para `Settings > Pages`
   - Selecione `Deploy from a branch`
   - Branch: `main` | Pasta: `/docs` ou `/dist`
   - Push do build: `git push origin main`

### Opção 2: Render (Frontend + Backend)

#### Deploy Frontend no Render

1. **Conectar Repositório ao Render**
   - Ir para [render.com](https://render.com)
   - Novo "Web Service"
   - Conectar GitHub
   - Selecionar repo

2. **Configurar Build**
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s dist`
   - **Environment**: `NODE_ENV=production`

3. **Deploy**
   - Render faz deploy automático a cada push

#### Deploy Backend (JSON Server) no Render

1. **Criar arquivo `server.js`** na raiz do projeto
   ```javascript
   const jsonServer = require('json-server');
   const server = jsonServer.create();
   const router = jsonServer.router('db/db.json');
   const middlewares = jsonServer.defaults();
   const port = process.env.PORT || 3000;

   server.use(middlewares);
   server.use(router);
   server.listen(port, () => {
     console.log(`JSON Server rodando em ${port}`);
   });
   ```

2. **Atualizar `package.json`**
   ```json
   {
     "scripts": {
       "serve": "vue-cli-service serve",
       "build": "vue-cli-service build",
       "bancojson": "json-server --watch db/db.json",
       "start": "node server.js"
     }
   }
   ```

3. **Render: Novo Web Service**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Adicionar `API_URL` com URL final

4. **Configurar `.env.production`**
   ```
   VUE_APP_API_BASE_URL=https://seu-app-backend.onrender.com
   ```

---

## 🗄️ Banco de Dados

### Desenvolvimento
- **JSON Server**: `http://localhost:3000`
- **Comando**: `npm run bancojson`
- **Arquivo**: `db/db.json`

### Produção
- **Supabase PostgreSQL**: Backend com autenticação, real-time e APIs automáticas
- **Documentação**: [SUPABASE.md](SUPABASE.md) - Guia completo de integração
- **Setup**: Criar projeto gratuito em [supabase.com](https://supabase.com)

---

## 🌐 URLs de Produção

| Recurso | URL |
|---------|-----|
| Frontend | `https://tpizzaria-frontend.onrender.com` |
| Backend (JSON Server) | `https://tpizzaria-api.onrender.com` |
| Banco de Dados | [Supabase Project](https://app.supabase.com) - Configurar |
| Repositório GitHub | `https://github.com/seu-usuario/Modelo-para-trabalho-de-dev-web` |

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento (Frontend)
npm run serve                # Rodas em http://localhost:8080

# Desenvolvimento (Backend)
npm run bancojson            # JSON Server em http://localhost:3000

# Build para Produção
npm run build                # Gera pasta /dist

# Execução completa local
npm run serve &              # Em uma aba
npm run bancojson            # Em outra aba
```

---

## 🎯 Fluxo de Uso

1. **Acessar Menu** → `/menu`
   - Browsear pizzas disponíveis
   - Clicar em "Selecionar" na pizza desejada

2. **Configurar Pedido** → `/config-pedido`
   - Preencher **Nome** (obrigatório, mín. 3 caracteres)
   - Selecionar **Tipo de Massa** (obrigatório)
   - Adicionar **Complementos e Bebidas** (opcionais)
   - Clicar "Confirmar Pedido"
   - ✅ Alerta de sucesso
   - **→ Automáticamente redireciona para Pedidos**

3. **Acompanhar Pedidos** → `/pedidos`
   - Lista todos os pedidos com status
   - Atualiza a cada 5 segundos
   - Mudar status via dropdown
   - Deletar com confirmação

---

## 📚 Referências

- [Vue 3 Docs](https://vuejs.org)
- [Vue Router](https://router.vuejs.org)
- [JSON Server](https://github.com/typicode/json-server) - Desenvolvimento
- [Supabase Docs](https://supabase.com/docs) - Produção
- [Render Deploy](https://render.com/docs)

---

## 🔗 Documentação Adicional

- **[SUPABASE.md](SUPABASE.md)** - Guia de integração com Supabase (banco de dados PostgreSQL)
- **[DEPLOY.md](DEPLOY.md)** - Instruções de deployment no Render e GitHub Pages
- **[MUDANCAS.md](MUDANCAS.md)** - Resumo de mudanças implementadas
- **[CHECKLIST.md](CHECKLIST.md)** - Status de implementação

---

## 👨‍💻 Autor

Desenvolvido como projeto de aprendizado em **Vue 3** com integração de backend.

---

## 📄 Licença

MIT

---

## ✅ Checklist Final

- [x] Validação de campos obrigatórios
- [x] Alertas semânticos com cores
- [x] Redirecionamento após pedido
- [x] Listagem com polling (5s)
- [x] Exclusão com re-render imediato
- [x] Deploy Frontend (GitHub Pages / Render)
- [x] Deploy Backend (JSON Server em Render)
- [x] README documentado
- [x] Integração Supabase (PostgreSQL para produção)
- [x] Serviço unificado API (JSON Server dev + Supabase prod)
- [x] Documentação Supabase completa
