const {Router} = require(`express`);
/**
 * @param {ArticleService} articleService
 * @param {CategoryService} categoryService
 * @param {FileStorageService} fileStorageService
 * @return {Router}
 */
module.exports = (articleService, categoryService, fileStorageService) => {
  const router = new Router();

  router.get(`/add`, async (req, res) => {
    const categories = await categoryService.getAll(false);

    res.render(`pages/new-post`, {categories, isAdmin: true});
  });

  router.post(`/add`, fileStorageService.getSingleUploadFn(), async (req, res) => {
    try {
      const {body, file} = req;
      const articleData = articleService.getArticleData(body, file);
      await articleService.createOne(articleData);
      return res.redirect(`/my`);
    } catch (ex) {
      return res.redirect(`back`);
    }
  });

  router.get(`/edit/:id`, async (req, res) => {
    const id = req.params[`id`];
    try {
      const article = await articleService.getOne(id);
      const categories = await categoryService.getAll(false);
      return res.render(`pages/new-post`, {isAdmin: true, article, categories});
    } catch (ex) {
      return res.render(`pages/404`, {isGuest: true});
    }
  });

  router.post(`/edit/:id`, fileStorageService.getSingleUploadFn(), async (req, res) => {
    const id = req.params[`id`];
    try {
      const {body, file} = req;
      const articleData = articleService.getArticleData(body, file);
      await articleService.changeOne(id, articleData);
      return res.redirect(`/my`);
    } catch (ex) {
      return res.redirect(`back`);
    }
  });

  router.get(`/category/:id`, async (req, res) => {
    const currentCategoryId = Number.parseInt(req.params[`id`], 10);

    try {
      if (isNaN(currentCategoryId)) {
        throw new Error(`Category id should be number`);
      }

      const categories = await categoryService.getAll(true);
      const currentCategory = categories.find((category) => category.id === currentCategoryId);

      if (currentCategory === undefined) {
        throw new Error(`Category not found`);
      }

      const articles = await articleService.getAll({comments: false});
      return res.render(`pages/articles-by-category`, {isUser: true, articles, categories, currentCategory});
    } catch (ex) {
      return res.render(`pages/404`, {isGuest: true});
    }
  });

  router.get(`/:id`, async (req, res) => {
    const id = req.params[`id`];

    try {
      const [article, categories] = await Promise.all([articleService.getOne(id), categoryService.getAll(false)]);

      return res.render(`pages/post`, {isUser: true, categories, article});
    } catch (ex) {
      return res.render(`pages/404`, {isGuest: true});
    }
  });

  return router;
};
