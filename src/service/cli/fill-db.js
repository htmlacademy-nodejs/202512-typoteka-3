const sequelize = require(`../lib/sequelize`)();
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);

const {
  getRandomInt,
  shuffle
} = require(`../../utils`);
const {ExitCode, ORANGE, ENCODING} = require(`../../constants`);

const FilePath = {
  TITLES: `./data/titles.txt`,
  SENTENCES: `./data/sentences.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  PICTURES: `./data/pictures.txt`,
};

const MAX_COMMENTS = 4;
const COMMENT_RESTRICT = 3;
const ANNOUNCE_RESTRICT = 5;

const PublicationsRestrict = {
  MIN: 1,
  MAX: 1000
};

const logger = getLogger({name: `api`});

/**
 * @typedef {{ id: string, title: string, createdDate: string, picture: string, announce: string, fullText: string, categories: Array<string>, comments: Array<Comment> }} Article
 */

/**
 * @param {string} filePath
 * @return {Promise<Array<string>>}
 */
const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, ENCODING);
    return content.split(`\n`).filter((it) => it !== ``);
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
 * @param {Array<string>} comments
 * @param {Array<string>} pictures
 * @param {Array<string>} categories
 * @return {Array<Article>}
 */
const generatePublications = (count, titles, sentences, comments, pictures, categories) => (
  Array(count).fill({}).map(() => ({
    title: shuffle(titles)[getRandomInt(0, titles.length - 1)],
    createdDate: getDate(),
    picture: shuffle(pictures)[getRandomInt(0, pictures.length - 1)],
    announce: shuffle(sentences).slice(0, getRandomInt(1, ANNOUNCE_RESTRICT)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    categories: shuffle(categories).slice(0, getRandomInt(0, categories.length - 1)),
  })
  )
);

const getCountPublications = (args) => {
  const [count] = args;
  let countPublications = Number.parseInt(count, 10) || PublicationsRestrict.MIN;

  if (countPublications > PublicationsRestrict.MAX) {
    console.info(chalk.hex(ORANGE)(`Notify: max publications count ${PublicationsRestrict.MAX}`));
    countPublications = PublicationsRestrict.MAX;
  }

  return countPublications;
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (ex) {
      logger.error(`An error occured: ${ex.message}`);
      process.exit(ExitCode.EXCEPTION);
    }
    logger.info(`Connection to database established`);

    let countPublications = getCountPublications(args);

    const promisesRead = Object.values(FilePath).map((path) => readContent(path));
    const [titles, sentences, categories, comments, pictures] = await Promise.all(promisesRead);

    const articles = generatePublications(countPublications, titles, sentences, comments, pictures, categories);

    return initDatabase(sequelize, articles, categories);
  }
};
