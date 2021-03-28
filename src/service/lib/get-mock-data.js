const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const FILENAME = `mocks.json`;

let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(FILENAME);
    data = JSON.parse(fileContent);
  } catch (ex) {
    console.error(chalk.red(ex));
    return Promise.reject(ex);
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
