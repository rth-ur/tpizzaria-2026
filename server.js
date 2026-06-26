const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db/db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

// Usar middlewares padrão
server.use(middlewares);

// Usar roteador padrão
server.use(router);

// Iniciar servidor
server.listen(port, () => {
    console.log(`JSON Server rodando na porta ${port}`);
    console.log(`Base URL: http://localhost:${port}`);
});
