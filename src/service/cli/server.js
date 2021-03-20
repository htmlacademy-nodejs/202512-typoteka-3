const express = require(`express`);
const chalk = require(`chalk`);
const mainRouter = require(`./routes/main`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  run(args) {
    const app = express();
    app.use(express.json());

    app.use(`/`, mainRouter);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      console.log(chalk.bgBlueBright.black(`Ожидаю соединений на ${port}`));
    });
  }
};
