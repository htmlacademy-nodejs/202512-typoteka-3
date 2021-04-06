const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../../constants`);

/**
 * @param {Router} app
 * @param {CategoryService} service
 */
module.exports = (app, service) => {
  const route = new Router();
  app.use(`/category`, route);

  /** Возвращает список доступных категорий */
  route.get(`/`, (req, res) => {
    const categories = service.findAll();
    return res.status(HttpCode.OK).json(categories);
  });
};

