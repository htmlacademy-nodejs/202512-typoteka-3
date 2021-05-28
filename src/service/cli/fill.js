const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle
} = require(`../../utils`);

const FILE_NAME = `fill-db.sql`;
const FilePath = {
  TITLES: `./data/titles.txt`,
  SENTENCES: `./data/sentences.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  AUTHORS: `./data/authors.txt`,
  PICTURES: `./data/pictures.txt`,
};

const COMMENT_RESTRICT = 3;
const ANNOUNCE_RESTRICT = 5;
const ARTICLE_COUNT = 3;
const COMMENT_COUNT = ARTICLE_COUNT * 2;

const {
  ExitCode,
  ORANGE,
  ENCODING
} = require(`../../constants`);

const PublicationsRestrict = {
  MIN: 1,
  MAX: 1000
};

const users = [
  {
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

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

const generateComments = (comments) => {
  return (
    Array(COMMENT_COUNT).fill(``).map(() => ({
      articleId: getRandomInt(1, ARTICLE_COUNT),
      text: shuffle(comments)
        .slice(0, getRandomInt(1, COMMENT_RESTRICT))
        .join(` `),
      createdDate: getDate()
    }))
  );
};

/**
 *
 * @param {Array<string>} categories
 * @return {Array<Category>}
 */
const prepareCategories = (categories) => {
  return categories.reduce((acc, category, index) => {
    if (category) {
      acc.push({
        id: index + 1,
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
 * @param {Array<string>} pictures
 * @return {Array<Article>}
 */
const generatePublications = (count, titles, sentences, categories, comments, pictures) => (
  Array(count).fill(``).map(() => {
    const title = shuffle(titles)[getRandomInt(0, titles.length - 1)];
    return {
      title,
      createdDate: getDate(),
      picture: shuffle(pictures)[getRandomInt(0, pictures.length - 1)],
      announce: shuffle(sentences).slice(0, getRandomInt(1, ANNOUNCE_RESTRICT)).join(` `),
      fullText: shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `),
      category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
      comments: generateComments(comments),
      userId: getRandomInt(1, users.length)
    };
  })
);
module.exports = {
  name: `--fill`,
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
      FilePath.PICTURES
    ].map((path) => readContent(path));

    const [titles, sentences, categories, commentSentences, pictures] = await Promise.all(promisesRead);

    const preparedCategories = prepareCategories(categories);

    const articles = generatePublications(countPublications, titles, sentences, preparedCategories, commentSentences, pictures);

    const comments = articles.flatMap((article) => article.comments);
    const articleCategory = articles.reduce((acc, article, index) => {
      const links = article.category.map((categoryItem) => ({articleId: index + 1, categoryId: categoryItem.id}));
      acc.push(...links);
      return acc;
    }, []);

    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}) =>
      `('${firstName}', '${lastName}', '${email}', '${passwordHash}', '${avatar}')`
    ).join(`,\n`);
    const categoryValues = preparedCategories.map((category) => `('${category.name}')`).join(`,\n`);
    const articleValues = articles.map(({title, announce, fullText, picture, createdDate, userId}) =>
      `('${title}', '${picture}', '${announce}', '${fullText}', '${createdDate}', '${userId}')`).join(`,\n`);
    const articleCategoryValues = articleCategory.map(({articleId, categoryId}) => `(${articleId}, '${categoryId}')`).join(`,\n`);
    const commentValues = comments.map(({articleId, text, createdDate}) => `(${articleId}, '${createdDate}', '${text}')`).join(`,\n`);

    const content = `
      TRUNCATE users, categories, articles, article_categories, comments RESTART IDENTITY;
      INSERT INTO users(first_name, last_name, email, password_hash, avatar) VALUES
      ${userValues};
      INSERT INTO categories(title) VALUES
      ${categoryValues};
      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(title, picture, announce, full_text, created_at, user_id) VALUES
      ${articleValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;
      ALTER TABLE article_categories DISABLE TRIGGER ALL;
      INSERT INTO article_categories(article_id, category_id) VALUES
      ${articleCategoryValues};
      ALTER TABLE article_categories ENABLE TRIGGER ALL;
      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO comments(article_id, created_at, text) VALUES
      ${commentValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;
    `;

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
