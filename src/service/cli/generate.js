const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle
} = require(`../../utils`);
const {
  ExitCode,
  ORANGE,
  MAX_ID_LENGTH,
  ENCODING
} = require(`../../constants`);

const FILE_NAME = `mocks.json`;
const FilePath = {
  TITLES: `./data/titles.txt`,
  SENTENCES: `./data/sentences.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`
};

const MAX_COMMENTS = 4;
const COMMENT_RESTRICT = 3;
const ANNOUNCE_RESTRICT = 5;

const PublicationsRestrict = {
  MIN: 1,
  MAX: 1000
};

/**
 * @typedef {{ id: string, text: string }} Comment
 * @typedef {{ id: string, title: string, createdDate: string, announce: string, fullText: string, category: Array<string>, comments: Array<Comment> }} Article
 */

/**
 * @param {string} filePath
 * @return {Promise<Array<string>>}
 */
const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, ENCODING);
    return content.split(`\n`);
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
 * Генерирует моки комментариев
 * @param {number} count
 * @param {Array<string>} comments
 * @return {Array<Comment>}
 */
const generateComments = (count, comments) => (
  Array(count).fill(``).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, COMMENT_RESTRICT))
      .join(` `)
  }))
);

/**
 * Генерирует моки публикаций
 * @param {number} count
 * @param {Array<string>} titles
 * @param {Array<string>} sentences
 * @param {Array<string>} categories
 * @param {Array<string>} comments
 * @return {Array<Article>}
 */
const generatePublications = (count, titles, sentences, categories, comments) => (
  Array(count).fill(``).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: shuffle(titles)[getRandomInt(0, titles.length - 1)],
    createdDate: getDate(),
    announce: shuffle(sentences).slice(0, getRandomInt(1, ANNOUNCE_RESTRICT)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length)).join(` `),
    categories: shuffle(categories).slice(0, getRandomInt(1, categories.length)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    let countPublications = Number.parseInt(count, 10) || PublicationsRestrict.MIN;

    if (countPublications > PublicationsRestrict.MAX) {
      console.info(chalk.hex(ORANGE)(`Notify: max publications count ${PublicationsRestrict.MAX}`));
      countPublications = PublicationsRestrict.MAX;
    }

    const [titles, sentences, categories, comments] = await Promise.all([
      readContent(FilePath.TITLES),
      readContent(FilePath.SENTENCES),
      readContent(FilePath.CATEGORIES),
      readContent(FilePath.COMMENTS)
    ]);

    const content = JSON.stringify(generatePublications(countPublications, titles, sentences, categories, comments));

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
