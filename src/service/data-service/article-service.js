const Alias = require(`../models/alias`);

/**
 * @typedef {*} Article
 */

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  /**
   * Возвращает все статьи
   * @param {boolean} needComments
   * @return {Array<Article>}
   */
  async findAll(needComments = false) {
    const include = [Alias.CATEGORIES];
    if (needComments) {
      include.push(Alias.COMMENTS);
    }
    const articles = await this._Article.findAll({include});
    return articles.map((item) => item.get());
  }

  /**
   * Возвращает статью
   * @param {string} id
   * @return {Article}
   */
  async findOne(id) {
    const article = await this._Article.findByPk(id, {include: [Alias.CATEGORIES, Alias.COMMENTS]});
    return article.get();
  }

  /**
   * Добавляет новую статью
   * @param {Partial<Article>} data
   * @return {Article}
   */
  async create(data) {
    const article = await this._Article.create(data);
    await article.addCategories(data.categories);
    return article.get();
  }

  /**
   * Редактирует статью
   * @param {string} id
   * @param {Partial<Article>} data
   * @return {Article}
   */
  async update(id, data) {
    const [affectedRows] = await this._Article.update(data, {
      where: {id}
    });
    return !!affectedRows;
  }

  /**
   * Удаляет статью
   * @param {string} id
   * @return {boolean}
   */
  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = ArticleService;
