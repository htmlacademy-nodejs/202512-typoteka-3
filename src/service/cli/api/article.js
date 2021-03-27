const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../../constants`);
const {
  articleExist,
  dataValidator
} = require(`../../middlewares`);

const RequiredFields = {
  ARTICLE: [`title`, `announce`, `fullText`, `category`],
  COMMENT: [`text`]
}

const articlesRouter = new Router();

/**
 * @param {Router} app
 * @param {ArticleService} articleService
 * @param {CommentService} commentService
 */
module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, articlesRouter);

  /** Возвращает список публикаций */
  articlesRouter.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  /** Возвращает полную информацию о публикации */
  articlesRouter.get(`/:articleId`, articleExist(articleService), (req, res) => {
    return res.status(HttpCode.OK).json(res.locals.article);
  });

  /** Создаёт новую публикацию */
  articlesRouter.post(`/`, dataValidator(RequiredFields.ARTICLE), (req, res) => {
    const newArticle = articleService.create(req.body);
    return res.status(HttpCode.CREATED).json(newArticle);
  });

  /** Редактирует определённую публикацию */
  articlesRouter.put(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articleService.update(articleId, req.body);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  /** Удаляет определённую публикацию */
  articlesRouter.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    articleService.drop(articleId);
    return res.status(HttpCode.SUCCESS);
  });

  /** Возвращает список комментариев определённой публикации */
  articlesRouter.get(`/:articleId/comments/`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    return res.status(HttpCode.OK).json(commentService.findAll(articleService.findAll(), articleId));
  });

  /** Добавляет новый комментарий определённой публикации */
  articlesRouter.post(`/:articleId/comments/`, [articleExist(articleService), dataValidator(RequiredFields.COMMENT)], (req, res) => {
    return res.status(HttpCode.CREATED).json(commentService.create(res.locals.article, req.body));
  });

  /** Удаляет из определённой публикации комментарий с идентификатором */
  articlesRouter.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {commentId} = req.params;
    commentService.drop(res.locals.article, commentId);
    return res.status(HttpCode.SUCCESS);
  });
};
