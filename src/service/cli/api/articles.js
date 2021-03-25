const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../../constants`);

const articlesRouter = new Router();

/**
 * @param {Router} app
 * @param {ArticlesService} service
 */
module.exports = (app, service) => {
  app.use(`/articles`, articlesRouter);

  /**
   * Возвращает список публикаций
   */
  articlesRouter.get(`/`, (req, res) => {
    const articles = service.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  /**
   * Возвращает полную информацию о публикации
   */
  articlesRouter.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = service.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  /**
   * Создаёт новую публикацию
   */
  articlesRouter.post(`/`, (req, res) => {

  });

  /**
   * Редактирует определённую публикацию
   */
  articlesRouter.put(`/:articleId`, (req, res) => {});

  /**
   * Удаляет определённое публикацию
   */
  articlesRouter.delete(`/:articleId`, (req, res) => {});

  /**
   * Возвращает список комментариев определённой публикации
   */
  articlesRouter.get(`/:articleId/comments/`, () => {});

  /**
   * Возвращает список комментариев определённой публикации
   */
  articlesRouter.post(`/:articleId/comments/`, () => {});

  /**
   * Удаляет из определённой публикации комментарий с идентификатором
   */
  articlesRouter.delete(`/:commentId`, () => {});
};
