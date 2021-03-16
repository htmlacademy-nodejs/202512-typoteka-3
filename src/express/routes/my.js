const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`pages/my`,
    {
      isAdmin: true
    })
);

myRouter.get(`/comments`, (req, res) => res.render(`pages/comments`,
    {
      isAdmin: true
    }
));

module.exports = myRouter;
