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
};

/**
 * @param {Router} app
 * @param {ArticleService} articleService
 * @param {CommentService} commentService
 */
module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  /** Возвращает список публикаций */
  route.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  /** Возвращает полную информацию о публикации */
  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    return res.status(HttpCode.OK).json(res.locals.article);
  });

  /** Создаёт новую публикацию */
  route.post(`/`, dataValidator(RequiredFields.ARTICLE), (req, res) => {
    const newArticle = articleService.create(req.body);
    return res.status(HttpCode.CREATED).json(newArticle);
  });

  /** Редактирует определённую публикацию */
  route.put(`/:articleId`, [articleExist(articleService), dataValidator(RequiredFields.ARTICLE)], (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articleService.update(articleId, req.body);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  /** Удаляет определённую публикацию */
  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    articleService.drop(articleId);
    return res.status(HttpCode.SUCCESS).end();
  });

  /** Возвращает список комментариев определённой публикации */
  route.get(`/:articleId/comments/`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    return res.status(HttpCode.OK).json(commentService.findAll(articleService.findAll(), articleId));
  });

  /** Добавляет новый комментарий определённой публикации */
  route.post(`/:articleId/comments/`, [articleExist(articleService), dataValidator(RequiredFields.COMMENT)], (req, res) => {
    return res.status(HttpCode.CREATED).json(commentService.create(res.locals.article, req.body));
  });

  /** Удаляет из определённой публикации комментарий с идентификатором */
  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {commentId} = req.params;
    const result = commentService.drop(res.locals.article, commentId);
    if (result) {
      return res.status(HttpCode.SUCCESS).end();
    }
    return res.sendStatus(HttpCode.NOT_FOUND);
  });
};
