const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../../constants`);

const searchRouter = new Router();

/**
 * @param {Router} app
 * @param {SearchService} service
 */
module.exports = (app, service) => {
  app.use(`/search`, searchRouter);

  /** Возвращает статьи, title которых имеют вхождение query */
  searchRouter.get(`/`, (req, res) => {
    const {query} = req.query;
    const articles = service.findAll(query);
    return res.status(HttpCode.OK).json(articles);
  });
};
