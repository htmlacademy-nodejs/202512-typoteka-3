const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../constants`);
const {
  articleExist,
  dataValidator
} = require(`../middlewares/index`);

const RequiredFields = {
  ARTICLE: [`title`, `announce`, `fullText`, `categories`, `picture`],
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
  route.get(`/`, async (req, res) => {
    let {offset, limit, comments} = req.query;
    comments = comments === `true`;
    limit = Number.parseInt(limit, 10);
    offset = Number.parseInt(offset, 10);
    let result;

    if (limit || offset) {
      result = await articleService.findPage(limit, offset);
    } else {
      result = await articleService.findAll(comments);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/hot`, async (req, res) => {
    let {limit} = req.query;
    limit = Number.parseInt(limit, 10);

    const result = await articleService.findHotArticles(limit);

    return res.status(HttpCode.OK).json(result);
  });

  /** Возвращает полную информацию о публикации */
  route.get(`/:articleId`, articleExist(articleService),
      (req, res) => {
        return res.status(HttpCode.OK).json(res.locals.article);
      });

  /** Создаёт новую публикацию */
  route.post(`/`, dataValidator(RequiredFields.ARTICLE),
      async (req, res) => {
        const newArticle = await articleService.create(req.body);
        return res.status(HttpCode.CREATED).json(newArticle);
      });

  /** Редактирует определённую публикацию */
  route.put(`/:articleId`, [articleExist(articleService), dataValidator(RequiredFields.ARTICLE)],
      async (req, res) => {
        const {articleId} = req.params;
        const updatedArticle = await articleService.update(articleId, req.body);
        return res.status(HttpCode.OK).json(updatedArticle);
      });

  /** Удаляет определённую публикацию */
  route.delete(`/:articleId`, articleExist(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        await articleService.drop(articleId);
        return res.status(HttpCode.SUCCESS).end();
      });

  /** Возвращает список комментариев определённой публикации */
  route.get(`/:articleId/comments/`, articleExist(articleService),
      async (req, res) => {
        const {articleId} = req.params;
        return res.status(HttpCode.OK).json(await commentService.findAll(articleId));
      });

  /** Добавляет новый комментарий определённой публикации */
  route.post(`/:articleId/comments/`, [articleExist(articleService), dataValidator(RequiredFields.COMMENT)],
      async (req, res) => {
        return res.status(HttpCode.CREATED).json(await commentService.create(res.locals.article.id, req.body));
      });

  /** Удаляет из определённой публикации комментарий с идентификатором */
  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService),
      async (req, res) => {
        const {commentId} = req.params;
        const result = await commentService.drop(commentId);
        if (result) {
          return res.status(HttpCode.SUCCESS).end();
        }
        return res.sendStatus(HttpCode.NOT_FOUND);
      });
};
