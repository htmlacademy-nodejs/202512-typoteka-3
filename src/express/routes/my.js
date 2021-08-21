const {Router} = require(`express`);

/**
 * @param {ArticleService} articleService
 * @return {Router}
 */
module.exports = (articleService) => {
  const router = new Router();

  router.get(`/`, async (req, res) => {
    const articles = await articleService.getAll(true);
    res.render(`pages/my`, {isAdmin: true, articles});
  });

  router.get(`/comments`, async (req, res) => {
    const articles = await articleService.getAll(true);
    const comments = [...articles.map((article) => article.comments)];
    res.render(`pages/comments`, {isAdmin: true, articles, comments});
  });

  return router;
};
