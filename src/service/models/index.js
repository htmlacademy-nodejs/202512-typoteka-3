const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineArticleCategory = require(`./article-category`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);

  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `articleId`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  Article.belongsToMany(Category, {
    through: ArticleCategory,
    as: Alias.CATEGORIES,
    foreignKey: `articleId`
  });
  Category.belongsToMany(Article, {
    through: ArticleCategory,
    as: Alias.ARTICLES,
    foreignKey: `categoryId`
  });
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES, foreignKey: `categoryId`});

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
