const express = require(`express`);
const chalk = require(`chalk`);
const routes = require(`./api`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  run(args) {
    const app = express();
    app.use(express.json());

    app.use(`api`, routes);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      console.log(chalk.bgBlueBright.black(`Ожидаю соединений на ${port}`));
    });
  }
};
