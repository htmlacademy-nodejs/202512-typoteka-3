/**
 * @typedef {{ id: number, title: string }} Category
 */

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }


  /** Возвращает список категорий
   * @param {boolean} needCount
   * @return {Array<Category>}
   */
  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [`id`, `title`, [Sequelize.fn(`COUNT`, `*`), `count`]],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Alias.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    }

    return this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
