const express = require(`express`);
const DEFAULT_PORT = 8080;

const mainRoutes = require(`./routes/main`);
const myRoutes = require(`./routes/my`);
const articlesRoutes = require(`./routes/articles`);

const app = express();

app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);

app.listen(DEFAULT_PORT, () => {
  console.log(`Сервер запущен на порту ${DEFAULT_PORT}`);
});
