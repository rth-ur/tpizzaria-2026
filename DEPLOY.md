# 🚀 Guia Completo de Deploy - TPizzaria

## 📋 Sumário

1. [Setup Local](#setup-local)
2. [Deploy Frontend - GitHub Pages](#deploy-frontend---github-pages)
3. [Deploy Backend - Render](#deploy-backend---render)
4. [Deploy Completo em Render](#deploy-completo-em-render)
5. [Troubleshooting](#troubleshooting)

---

## Setup Local

### Pré-requisitos
- Node.js v14+
- npm v6+
- Git

### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/Modelo-para-trabalho-de-dev-web.git
cd "Projeto Final/tpizzaria"

# 2. Instalar dependências
npm install

# 3. Criar arquivo .env.development
cat > .env.development << EOF
VUE_APP_API_BASE_URL=http://localhost:3000
EOF

# 4. Em um terminal, rodar Frontend
npm run serve

# 5. Em outro terminal, rodar Backend
npm run bancojson
```

**Resultado**: App rodando em `http://localhost:8080` com API em `http://localhost:3000`

---

## Deploy Frontend - GitHub Pages

### Passo 1: Build Localmente

```bash
npm run build
```

Isso cria pasta `/dist` pronta para produção.

### Passo 2: Fazer Push para GitHub

```bash
# Se for primeiro deploy, criar repositório vazio
git init
git add .
git commit -m "Initial commit: TPizzaria"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/REPO-NAME.git
git push -u origin main
```

### Passo 3: Configurar GitHub Pages

1. Ir para `Settings > Pages`
2. **Source**: Deploy from a branch
3. **Branch**: `main`
4. **Folder**: `/(root)` ou `/docs` (se moveu `dist` para `docs`)
5. Clicar **Save**

### Passo 4: Deploy

```bash
# Opção A: Mover build para docs/
rm -rf docs
mv dist docs
git add docs
git commit -m "Deploy to GitHub Pages"
git push origin main
```

**Resultado**: App disponível em `https://seu-usuario.github.io/REPO-NAME/`

---

## Deploy Backend - Render

### Passo 1: Preparar Backend

Criar arquivo `server.js` na raiz do projeto:

```javascript
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db/db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);
server.listen(port, () => {
  console.log(`JSON Server rodando na porta ${port}`);
});
```

### Passo 2: Atualizar package.json

```json
{
  "name": "tpizzaria",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "bancojson": "json-server --watch db/db.json",
    "start": "node server.js"
  },
  "dependencies": {
    "json-server": "^0.17.4",
    "vue": "^3.2.13",
    "vue-router": "^4.0.3"
  }
}
```

### Passo 3: Criar Render Web Service

1. Ir para [render.com](https://render.com)
2. **New** → **Web Service**
3. Conectar GitHub e selecionar repositório
4. Preencher:
   - **Name**: `tpizzaria-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment**: 
   - `NODE_ENV=production`
   - `PORT=3000`
6. Clicar **Create Web Service**

**Resultado**: API disponível em `https://tpizzaria-api.onrender.com`

---

## Deploy Completo em Render

### Alternativa: Deploy Frontend + Backend no Render

#### Opção 1: Monorepo (Frontend + Backend)

**Estrutura:**
```
tpizzaria/
├── server.js              ← Backend
├── db/db.json
├── public/
├── src/
├── package.json
└── ...
```

**Render Config** (cria arquivo `render.yaml`):

```yaml
services:
  - type: web
    name: tpizzaria-web
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: VUE_APP_API_BASE_URL
        value: https://tpizzaria-web.onrender.com/api
```

#### Opção 2: Serviços Separados (Recomendado)

**Frontend Service (Render)**
```yaml
# render-frontend.yaml
buildCommand: npm run build
startCommand: npx serve -s dist
```

**Backend Service (Render)**
```yaml
# render-backend.yaml
buildCommand: npm install
startCommand: node server.js
```

---

## Variáveis de Ambiente

### `.env.development`
```env
VUE_APP_API_BASE_URL=http://localhost:3000
```

### `.env.production`
```env
VUE_APP_API_BASE_URL=https://tpizzaria-api.onrender.com
```

### GitHub Pages + Render Backend
```env
VUE_APP_API_BASE_URL=https://tpizzaria-api.onrender.com
```

---

## URLs Finais

| Ambiente | Frontend | Backend |
|----------|----------|---------|
| **Local** | `http://localhost:8080` | `http://localhost:3000` |
| **GitHub Pages** | `https://seu-usuario.github.io/repo` | `https://tpizzaria-api.onrender.com` |
| **Render Full** | `https://tpizzaria-web.onrender.com` | `https://tpizzaria-api.onrender.com` |

---

## Troubleshooting

### ❌ "Cannot resolve module 'json-server'"

```bash
npm install json-server --save
```

### ❌ "Module not found: /img/banner.png"

```bash
# Verificar se arquivo existe
ls src/assets/banner.png

# Se não existir, copiar de public/img
cp public/img/banner.png src/assets/banner.png
```

### ❌ "API Error: Failed to fetch"

1. Verificar se JSON Server está rodando
2. Confirmar URL em `.env.development`
3. Verificar CORS (JSON Server permite por padrão)

### ❌ "Build fails on Render"

1. **Limpar cache Render**: Settings > Clear Build Cache
2. **Verificar `package.json`**: tem `json-server`?
3. **Logs**: Ver output completo em Render dashboard

### ❌ "GitHub Pages shows 404"

1. Verificar se `/dist` ou `/docs` está no repositório
2. Confirmar `vue.config.js` está correto
3. Esperar 1-2 minutos após push

---

## Checklist de Deploy

- [ ] App rodando localmente (`npm run serve + npm run bancojson`)
- [ ] Build gera `/dist` sem erros (`npm run build`)
- [ ] `.env.development` e `.env.production` configurados
- [ ] Repositório GitHub criado e código pusheado
- [ ] GitHub Pages ativado em Settings > Pages
- [ ] Render Web Service para backend criado
- [ ] Variáveis de ambiente no Render configuradas
- [ ] Frontend testa conexão com API de produção
- [ ] Polling (5s) funciona na listagem
- [ ] Redirecionamento pós-pedido funciona
- [ ] Deploy finalizado e URLs testadas

---

## Scripts Úteis

```bash
# Build + Deploy local
npm run build && npx serve -s dist

# Teste de API
curl https://tpizzaria-api.onrender.com/pedidos

# Clear node_modules (se der problema)
rm -rf node_modules && npm install

# Verificar variáveis de ambiente
echo $VUE_APP_API_BASE_URL
```

---

**Pronto para Deploy! 🚀**
