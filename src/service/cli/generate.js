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
  COMMENTS: `./data/comments.txt`,
  AUTHORS: `./data/authors.txt`,
  PICTURES: `./data/pictures.txt`,
};

const MAX_COMMENTS = 4;
const COMMENT_RESTRICT = 3;
const ANNOUNCE_RESTRICT = 5;

const PublicationsRestrict = {
  MIN: 1,
  MAX: 1000
};

/**
 * @typedef {{ id: string, author: string, text: string, createdDate: string, articleId: string, articleTitle: string }} Comment
 * @typedef {{ id: string, title: string, createdDate: string, picture: string, announce: string, fullText: string, category: Array<string>, comments: Array<Comment> }} Article
 * @typedef {{ id: string, name: string }} Category
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
 * @param {Array<string>} authors
 * @return {Array<Comment>}
 */
const generateComments = (count, comments, authors) => (
  // TODO: Дата создания комментария
  Array(count).fill(``).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, COMMENT_RESTRICT))
      .join(` `),
    author: shuffle(authors)[getRandomInt(0, authors.length - 1)],
  }))
);

/**
 *
 * @param {Array<string>} categories
 * @return {Array<Category>}
 */
const prepareCategories = (categories) => {
  return categories.reduce((acc, category) => {
    if (category) {
      acc.push({
        id: nanoid(MAX_ID_LENGTH),
        name: category
      });
    }
    return acc;
  }, []);
};

/**
 * Генерирует моки публикаций
 * @param {number} count
 * @param {Array<string>} titles
 * @param {Array<string>} sentences
 * @param {Array<Category>} categories
 * @param {Array<string>} comments
 * @param {Array<string>} authors
 * @param {Array<string>} pictures
 * @return {Array<Article>}
 */
const generatePublications = (count, titles, sentences, categories, comments, authors, pictures) => (
  Array(count).fill(``).map(() => {
    const id = nanoid(MAX_ID_LENGTH);
    const title = shuffle(titles)[getRandomInt(0, titles.length - 1)];

    return {
      id,
      title,
      createdDate: getDate(),
      picture: shuffle(pictures)[getRandomInt(0, pictures.length - 1)],
      announce: shuffle(sentences).slice(0, getRandomInt(1, ANNOUNCE_RESTRICT)).join(` `),
      fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
      category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
      comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, authors)
        .map((comment) => Object.assign({
          articleId: id,
          articleTitle: title
        }, comment))
    };
  })
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

    const promisesRead = [
      FilePath.TITLES,
      FilePath.SENTENCES,
      FilePath.CATEGORIES,
      FilePath.COMMENTS,
      FilePath.AUTHORS,
      FilePath.PICTURES
    ].map((path) => readContent(path));

    const [titles, sentences, categories, comments, authors, pictures] = await Promise.all(promisesRead);

    const content = JSON.stringify(generatePublications(countPublications, titles, sentences, prepareCategories(categories), comments, authors, pictures));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created`));
      process.exit(ExitCode.SUCCESS);
    } catch (ex) {
      console.error(chalk.red(`Can't write data to file : ${ex}`));
      process.exit(ExitCode.EXCEPTION);
    }
  }
};
