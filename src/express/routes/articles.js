const {Router} = require(`express`);
const {nanoid} = require(`nanoid`);
const multer = require(`multer`);
const path = require(`path`);

const UPLOAD_DIR = `../upload/img/`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const MAX_SYMBOLS_FILENAME = 10;

/**
 * @param {API} api
 * @return {Router}
 */
module.exports = module.exports = (api) => {
  const router = new Router();

  const storage = multer.diskStorage({
    destination: uploadDirAbsolute,
    filename: (req, file, cb) => {
      const uniqueName = nanoid(MAX_SYMBOLS_FILENAME);
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    }
  });

  const upload = multer({storage});

  router.get(`/add`, async (req, res) => {
    const categories = await api.getCategories();
    res.render(`pages/new-post`,
        {
          categories,
          isAdmin: true
        });
  }
  );

  router.post(`/add`, upload.single(`upload`), async (req, res) => {
    const {body, file} = req;
    const categories = await api.getCategories();

    const articleData = {
      picture: file.filename,
      title: body.title,
      category: categories.filter((category) => body.category.includes(category.id)),
      announce: body.announce,
      fullText: body.fullText
    };

    try {
      await api.createArticle(articleData);
      res.redirect(`/my`);
    } catch (ex) {
      res.redirect(`back`);
    }
  });

  router.get(`/edit/:id`, async (req, res) => {
    const id = req.params[`id`];
    try {
      const article = await api.getArticle(id);
      return res.render(`pages/new-post`, {isAdmin: true, article});
    } catch (ex) {
      return res.render(`pages/404`, {isGuest: true});
    }
  });

  router.get(`/category/:id`, async (req, res) => {
    const [articles, categories] = await Promise.all([api.getArticles(), api.getCategories()]);
    const currentCategory = categories.find((category) => category.id === req.params[`id`]);

    res.render(`pages/articles-by-category`, {isUser: true, articles, categories, currentCategory});
  });

  router.get(`/:id`, async (req, res) => {
    const id = req.params[`id`];

    try {
      const [article, categories] = await Promise.all([api.getArticle(id), api.getCategories()]);
      return res.render(`pages/post`, {isUser: true, categories, article, comments: article.comments});
    } catch (ex) {
      return res.render(`pages/404`, {isGuest: true});
    }
  });

  return router;
};
