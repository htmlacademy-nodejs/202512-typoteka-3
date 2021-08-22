const {Router} = require(`express`);
const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);
const comment = require(`./comment`);
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
    const commentService = new CommentService(sequelize);

    article(app, new ArticleService(sequelize), commentService);
    category(app, new CategoryService(sequelize));
    search(app, new SearchService(sequelize));
    comment(app, commentService);
  })();

  return app;
};
