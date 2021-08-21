const express = require(`express`);
const path = require(`path`);
const chalk = require(`chalk`);
const api = require(`./api`).getAPI();
const getMainRoutes = require(`./routes/main`);
const getMyRoutes = require(`./routes/my`);
const getArticleRoutes = require(`./routes/articles`);

const {
  ArticleService,
  CategoryService,
  FileStorageService,
  CommentService,
} = require(`./data-service/index`);

const DEFAULT_PORT = 8080;
const Dir = {
  PUBLIC: `public`,
  UPLOAD: `upload`,
  TEMPLATES: `templates`
};

const articleService = new ArticleService(api);
const categoryService = new CategoryService(api);
const commentService = new CommentService(api);
const fileStorageService = new FileStorageService();

const mainRoutes = getMainRoutes(articleService, categoryService, commentService);
const myRoutes = getMyRoutes(articleService);
const articlesRoutes = getArticleRoutes(articleService, categoryService, fileStorageService);

const app = express();

app.set(`views`, path.resolve(__dirname, Dir.TEMPLATES));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, Dir.PUBLIC)));
app.use(express.static(path.resolve(__dirname, Dir.UPLOAD)));
app.use(`/`, mainRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`*`, (req, res) => res.render(`pages/404`, {isGuest: true}));

app.listen(DEFAULT_PORT, () => {
  console.log(chalk.bgBlueBright.black(`Ожидаю соединений на ${DEFAULT_PORT}`));
});
