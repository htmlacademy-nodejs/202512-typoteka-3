const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle
} = require(`../../utils`);
const {
  ExitCode
} = require(`../../constants`);
const chalk = require(`chalk`);


const FILE_NAME = `mocks.json`;
const ANNOUNCE_RESTRICT = 5;
const ENCODING = `utf-8`;
const FilePath = {
  TITLES: `./data/titles.txt`,
  SENTENCES: `./data/sentences.txt`,
  CATEGORIES: `./data/categories.txt`
};

const PublicationsRestrict = {
  MIN: 1,
  MAX: 1000
};

/**
 * @param {string} filePath
 * @return {Promise<Array<string>>}
 */
const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, ENCODING);
    return content.split();
  } catch (ex) {
    console.log(chalk.red(ex));
    return [];
  }
};

/**
 * Генерирует дату публикации
 * @return {string}
 */
const getDate = () => {
  const maxMonthGap = 2;

  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - getRandomInt(0, maxMonthGap));
  const diff = Date.now() - minDate.valueOf();
  const publicationDate = new Date(Date.now() - getRandomInt(0, diff));

  return publicationDate.toISOString();
};

/**
 * Генерирует моки публикаций
 * @param {number} count
 * @param {Array<string>} titles
 * @param {Array<string>} sentences
 * @param {Array<string>} categories
 * @return {Array<{ title: string, createdDate: string, announce: string, fullText: string, category: Array<string> }>}
 */
const generatePublications = (count, titles, sentences, categories) => (
  Array(count).fill(``).map(() => ({
    title: shuffle(titles)[getRandomInt(0, titles.length - 1)],
    createdDate: getDate(),
    announce: shuffle(sentences).slice(0, getRandomInt(1, ANNOUNCE_RESTRICT)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length))
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    let countPublications = Number.parseInt(count, 10) || PublicationsRestrict.MIN;

    if (countPublications > PublicationsRestrict.MAX) {
      console.info(`Notify: max publications count ${PublicationsRestrict.MAX}`);
      countPublications = PublicationsRestrict.MAX;
    }

    const [titles, sentences, categories] = await Promise.all([
      readContent(FilePath.TITLES),
      readContent(FilePath.SENTENCES),
      readContent(FilePath.CATEGORIES)
    ]);

    const content = JSON.stringify(generatePublications(countPublications, titles, sentences, categories));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created`));
      process.exit(ExitCode.success);
    } catch (ex) {
      console.error(chalk.red(`Can't write data to file : ${ex}`));
      process.exit(ExitCode.exception);
    }
  }
};
