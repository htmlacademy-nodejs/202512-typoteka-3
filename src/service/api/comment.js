const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../constants`);

/**
 * @param {Router} app
 * @param {CommentService} service
 */
module.exports = (app, service) => {
  const route = new Router();
  app.use(`/comment`, route);

  /** Возвращает все комментарии к публикациям пользователя */
  route.get(`/`, async (req, res) => {
    // TODO: Комментарии пользователя
    return res.status(HttpCode.NOT_FOUND).send(`Not found`);
  });

  /** Возвращает последние комментарии */
  route.get(`/last`, async (req, res) => {
    const {limit} = req.query;
    const comments = await service.findLastComments(limit);
    return res.status(HttpCode.OK).json(comments);
  });
};

