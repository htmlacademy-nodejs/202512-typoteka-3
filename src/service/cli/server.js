const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const {
  HttpCode
} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

/**
 * @param {any} res
 * @param {string} statusCode
 * @param {string} message
 */
const sendResponse = (res, statusCode, message) => {
  const template = `
    <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title></title>
      </head>
      <body>
        ${message}
      </body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    [`Content-Type`]: `text/html; charset=UTF-8`
  });

  res.end(template);
};

/**
 * @param {any} req
 * @param {any} res
 * @return {Promise<void>}
 */
const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.NOT_FOUND, message);
      } catch (ex) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (ex) => {
        if (ex) {
          return console.error(chalk.red(`Ошибка при создании сервера`), ex);
        }

        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
  }
};
