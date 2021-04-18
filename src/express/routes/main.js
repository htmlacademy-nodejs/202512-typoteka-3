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
 * @param {API} api
 * @return {Router}
 */
module.exports = (api) => {
  const router = new Router();

  router.get(`/`, async (req, res) => {
    const articles = await api.getArticles();
    const categories = await api.getCategories();
    const comments = [...articles.map((article) => article.comments)];

    res.render(`pages/main`, {articles, categories, comments, isUser: true});
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
      results = await api.search(search);
    }

    res.render(`pages/search`, {isGuest: true, results});
  });

  router.get(`/categories`, async (req, res) => {
    const categories = await api.getCategories();
    res.render(`pages/all-categories`, {categories, isAdmin: true});
  });

  return router;
};
