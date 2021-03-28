const {Router} = require(`express`);
const {
  HttpCode
} = require(`../../../constants`);

const categoriesRouter = new Router();

/**
 * @param {Router} app
 * @param {CategoryService} service
 */
module.exports = (app, service) => {
  app.use(`/categories`, categoriesRouter);

  /** Возвращает список доступных категорий */
  categoriesRouter.get(`/`, (req, res) => {
    const categories = service.findAll();
    return res.status(HttpCode.OK).json(categories);
  });
};

