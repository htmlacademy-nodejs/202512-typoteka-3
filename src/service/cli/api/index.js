const {Router} = require(`express`);
const articlesRouter = require(`./articles`);

const router = new Router();

router.use(`/articles`, articlesRouter);

module.exports = router;
