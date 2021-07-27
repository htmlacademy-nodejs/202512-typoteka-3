const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../constants`);

/**
 * @param {Router} app
 * @param {SearchService} service
 */
module.exports = (app, service) => {
  const route = new Router();
  app.use(`/search`, route);

  /** Возвращает статьи, title которых имеют вхождение query */
  route.get(`/`, async (req, res) => {
    const {query} = req.query;

    if (query) {
      const articles = await service.findAll(query);
      return res.status(HttpCode.OK).json(articles);
    }

    return res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  });
};
