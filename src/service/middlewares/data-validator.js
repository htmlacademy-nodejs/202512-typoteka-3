const {
  HttpCode
} = require(`../../constants`);

/**
 * Создает и возвращает middleware для валидации
 * @param {Array<string>} fields - обязательные поля
 * @return {Function} Middleware
 */
module.exports = (fields) => (req, res, next) => {
  const newData = req.body;
  const keys = Object.keys(newData);
  const keysExist = fields.every((field) => keys.includes(field));

  if (!keysExist) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  next();
}
