const {Router} = require(`express`);
const articlesRouter = new Router();
const {
  posts,
  CATEGORIES
} = require(`../mocks`);

articlesRouter.get(`/add`, (req, res) => res.render(`pages/new-post`,
    {
      isAdmin: true
    })
);
articlesRouter.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));

articlesRouter.get(`/category/:id`, (req, res) => {
  const currentCategory = CATEGORIES.find((category) => category.name === req.params[`id`]);
  res.render(`pages/articles-by-category`,
      {
        isUser: true,
        posts,
        categories: CATEGORIES,
        currentCategory
      });
}
);

articlesRouter.get(`/:id`, (req, res) => res.render(`pages/post`,
    {
      isUser: true,
      categories: CATEGORIES
    })
);

module.exports = articlesRouter;
