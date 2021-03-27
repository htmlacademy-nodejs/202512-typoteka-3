const {
  HttpCode
} = require(`../../constants`);

const commentKeys = [`text`, `author`];

module.exports = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const keysExist = commentKeys.every((key) => keys.includes(key));

  if (!keysExist) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  next();
};
