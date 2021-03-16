const {Router} = require(`express`);
const mainRouter = new Router();

const {
  posts,
  CATEGORIES,
  comments,
  LoginOptions,
  RegistrationOptions,
  results
} = require(`../mocks`);

mainRouter.get(`/`, (req, res) => res.render(`pages/main`, {
  posts,
  comments,
  categories: CATEGORIES,
  isUser: true
})
);

mainRouter.get(`/register`, (req, res) => res.render(`pages/sign-up`,
    {
      isGuest: true,
      fields: RegistrationOptions.FIELDS,
      errors: RegistrationOptions.ERRORS
    })
);

mainRouter.get(`/login`, (req, res) => res.render(`pages/login`,
    {
      isGuest: true,
      fields: LoginOptions.FIELDS
    })
);

mainRouter.get(`/search`, (req, res) => res.render(`pages/search`,
    {
      isGuest: true,
      results
    })
);

mainRouter.get(`/categories`, (req, res) => res.render(`pages/all-categories`,
    {
      categories: CATEGORIES,
      isAdmin: true
    })
);

module.exports = mainRouter;
