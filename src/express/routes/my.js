const {Router} = require(`express`);

/**
 * @param {API} api
 * @return {Router}
 */
module.exports = (api) => {
  const router = new Router();

  router.get(`/`, async (req, res) => {
    const articles = await api.getArticles();
    res.render(`pages/my`, {isAdmin: true, articles});
  });

  router.get(`/comments`, async (req, res) => {
    const articles = await api.getArticles();
    const comments = [...articles.map((article) => article.comments)];
    res.render(`pages/comments`, {isAdmin: true, articles, comments});
  });

  return router;
};
