const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../../constants`);
const articleValidator = require(`../../middlewares/article-validator`);
const articleExist = require(`../../middlewares/article-exist`);
const commentValidator = require(`../../middlewares/comment-validator`);

const articlesRouter = new Router();

/**
 * @param {Router} app
 * @param {ArticleService} service
 */
module.exports = (app, service) => {
  app.use(`/articles`, articlesRouter);

  /** Возвращает список публикаций */
  articlesRouter.get(`/`, (req, res) => {
    const articles = service.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  /** Возвращает полную информацию о публикации */
  articlesRouter.get(`/:articleId`, articleExist(service), (req, res) => {
    return res.status(HttpCode.OK).json(res.locals.article);
  });

  /** Создаёт новую публикацию */
  articlesRouter.post(`/`, articleValidator, (req, res) => {
    const newArticle = service.create(req.body);
    return res.status(HttpCode.CREATED).json(newArticle);
  });

  /** Редактирует определённую публикацию */
  articlesRouter.put(`/:articleId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = service.update(articleId, req.body);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  /** Удаляет определённую публикацию */
  articlesRouter.delete(`/:articleId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    service.drop(articleId);
    return res.status(HttpCode.SUCCESS).send(`Success`);
  });

  /** Возвращает список комментариев определённой публикации */
  articlesRouter.get(`/:articleId/comments/`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    return res.status(HttpCode.OK).json(service.findArticleComments(articleId));
  });

  /** Добавляет новый комментарий определённой публикации */
  articlesRouter.post(`/:articleId/comments/`, [articleExist(service), commentValidator], (req, res) => {
    const {articleId} = req.params;
    return res.status(HttpCode.CREATED).json(service.createComment(articleId, req.body));
  });

  /** Удаляет из определённой публикации комментарий с идентификатором */
  articlesRouter.delete(`/:articleId/:commentId`, articleExist(service), (req, res) => {
    const {articleId} = req.params;
    const {commentId} = req.params;
    service.dropComment(articleId, commentId);
    return res.status(HttpCode.SUCCESS).send(`Success`);
  });
};
