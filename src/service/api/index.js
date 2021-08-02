const {Router} = require(`express`);
const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);
const {
  ArticleService,
  CommentService,
  CategoryService,
  SearchService
} = require(`../data-service/index`);
const defineModels = require(`../models/index`);

module.exports = (sequelize) => {
  const app = new Router();

  defineModels(sequelize);

  (async () => {
    article(app, new ArticleService(sequelize), new CommentService(sequelize));
    category(app, new CategoryService(sequelize));
    search(app, new SearchService(sequelize));
  })();

  return app;
};
