const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.gray(`
      Программа запускает http-сервер и формирует файл с данными для API.

        Гайд:
          service.js <command>

          Команды:
          --version:            выводит номер версии
          --help:               печатает этот текст
          --filldb <count>      заполняет моками базу данных
    `));
  }
};
