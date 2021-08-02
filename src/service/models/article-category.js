const {Model} = require(`sequelize`);

class ArticleCategory extends Model {}
const define = (sequelize) => ArticleCategory.init({}, {
  modelName: `ArticleCategory`,
  tableName: `articleCategories`,
  sequelize,
  timestamps: false,
});

module.exports = define;
