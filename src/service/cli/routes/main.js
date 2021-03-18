const {Router} = require(`express`);
const fs = require(`fs`).promises;

const FILENAME = `mocks.json`;

const mainRouter = new Router();


mainRouter.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (ex) {
    res.json([]);
  }
});

module.exports = mainRouter;
