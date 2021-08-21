const {Router} = require(`express`);

const RegistrationOptions = {
  FIELDS: [
    {
      type: `email`,
      name: `email`,
      placeholder: `Электронная почта`,
      isRequired: true
    },
    {
      type: `text`,
      name: `name`,
      placeholder: `Имя`,
      isRequired: true
    },
    {
      type: `text`,
      name: `surname`,
      placeholder: `Фамилия`,
      isRequired: false
    },
    {
      type: `password`,
      name: `password`,
      placeholder: `Пароль`,
      isRequired: true
    },
    {
      type: `password`,
      name: `repeat-password`,
      placeholder: `Повтор пароля`,
      isRequired: true
    }
  ],
  ERRORS: [
    `Пароль не может состоять из двух букв`,
    `Фамилия не должна быть смешной`
  ]
};

const LoginOptions = {
  FIELDS: [
    {
      type: `email`,
      name: `email`,
      placeholder: `Электронная почта`,
      isRequired: true
    },
    {
      type: `password`,
      name: `password`,
      placeholder: `Пароль`,
      isRequired: true
    }
  ]
};

/**
 * @param {ArticleService} articleService
 * @param {CategoryService} categoryService
 * @param {CommentService} commentService
 * @return {Router}
 */
module.exports = (articleService, categoryService, commentService) => {
  const router = new Router();

  router.get(`/`, async (req, res) => {
    try {
      const {page} = req.query;
      const [articleData, hotArticles, lastComments, categories] = await Promise.all([
        articleService.getAllByPage(page, true),
        articleService.getHotArticles(),
        commentService.getLast(),
        categoryService.getAll(true)
      ]);

      const pagination = {
        currentPage: +page || 1,
        pageCount: articleService.calculatePages(articleData.count)
      };

      return res.render(`pages/main`, {
        articleData,
        hotArticles,
        comments: lastComments,
        categories,
        pagination,
        isUser: true
      });
    } catch (ex) {
      return res.render(`pages/500`);
    }
  });

  router.get(`/register`, (req, res) => res.render(`pages/sign-up`,
      {
        isGuest: true,
        fields: RegistrationOptions.FIELDS,
        errors: RegistrationOptions.ERRORS
      })
  );

  router.get(`/login`, (req, res) => res.render(`pages/login`,
      {
        isGuest: true,
        fields: LoginOptions.FIELDS
      })
  );

  router.get(`/search`, async (req, res) => {
    const {search} = req.query;
    let results = [];
    if (search) {
      results = await articleService.getAllBySearchQuery(search);
    }

    res.render(`pages/search`, {isGuest: true, results});
  });

  router.get(`/categories`, async (req, res) => {
    const categories = await categoryService.getAll(true);
    res.render(`pages/all-categories`, {categories, isAdmin: true});
  });

  return router;
};
