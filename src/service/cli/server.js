const express = require(`express`);
const routes = require(`./api`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const {
  HttpCode,
  ExitCode
} = require(`../../constants`);

const DEFAULT_PORT = 3000;

const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (ex) {
      logger.error(`An error occured: ${ex.message}`);
      process.exit(ExitCode.EXCEPTION);
    }

    logger.info(`Connection to database established`);

    const app = express();
    app.use(express.json());

    app.use((req, res, next) => {
      // Новый запрос от клиента. Фиксирует маршрут запроса (уровень «debug»)
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        // Статус-код, отправленный клиенту после выполнения запроса (уровень «info»)
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    app.use(`/api`, routes);


    app.use((ex, _req, _res, _next) => {
      // Ошибки
      logger.error(`An error occured on processing request: ${ex.message}`);
    });

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(`Not found`);
      // Запросы от клиентов на не существующие маршруты (уровень «error»)
      logger.error(`Route not found: ${req.url}`);
    });

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    try {
      app.listen(port, (ex) => {
        if (ex) {
          return logger.error(`An error occured on server creation: ${ex.message}`);
        }
        // Запуск сервера (уровень «info»)
        return logger.info(`Ожидаю соединений на ${port}`);
      });
    } catch (ex) {
      // Ошибки при запуске сервера (уровень «error»)
      logger.error(`An error occured: ${ex.message}`);
      process.exit(ExitCode.EXCEPTION);
    }
  }
};
