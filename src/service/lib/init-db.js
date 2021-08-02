const defineModels = require(`../models`);
const Alias = require(`../models/alias`);

/**
 * Инициализация ДБ
 * @param {sequelize} sequelize
 * @param {Array<Article>} articles
 * @param {Array<string>} categories
 */
const initDatabase = async (sequelize, articles, categories) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((category) => ({title: category}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.title]: next.id,
    ...acc
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Alias.COMMENTS]});
    await articleModel.addCategories(
        article.categories.map((category) => categoryIdByName[category])
    );
  });

  await Promise.all(articlePromises);
};

module.exports = initDatabase;
