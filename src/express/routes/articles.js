const {Router} = require(`express`);

/**
 * @param {API} api
 * @return {Router}
 */
module.exports = module.exports = (api) => {
  const router = new Router();

  router.get(`/add`, (req, res) => res.render(`pages/new-post`,
      {
        isAdmin: true
      })
  );

  router.get(`/edit/:id`, async (req, res) => {
    const id = req.params[`id`];
    const article = await api.getArticle(id);
    if (article) {
      return res.render(`pages/new-post`, {isAdmin: true, article});
    }
    return res.render(`pages/404`, {isGuest: true});
  });

  router.get(`/category/:id`, async (req, res) => {
    const [articles, categories] = await Promise.all([api.getArticles(), api.getCategories()])
    const currentCategory = categories.find((category) => category.id === req.params[`id`]);

    res.render(`pages/articles-by-category`, {isUser: true, articles, categories, currentCategory});
  });

  router.get(`/:id`, async (req, res) => {
    const id = req.params[`id`];
    const article = await api.getArticle(id);
    const categories = await api.getCategories();

    res.render(`pages/post`, {isUser: true, categories, article, comments: article.comments});
  });

  return router;
};
