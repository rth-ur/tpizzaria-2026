import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// Aqui criamos uma variável Global chamada apiUrl
// - Em dev: localhost JSON Server
// - Em prod: variável de ambiente ou rota local /api
app.config.globalProperties.$apiUrl =
  process.env.VUE_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api-tpizzaria.onrender.com');

app.use(router).mount("#app");
