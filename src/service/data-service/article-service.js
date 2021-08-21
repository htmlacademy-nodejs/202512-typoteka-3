const Alias = require(`../models/alias`);
const Sequelize = require(`sequelize`);

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
   * @return {Promise<Array<Article>>}
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
   * Возвращает статьи на страницу и кол-во записей в БД
   * @param {number} limit
   * @param {number} offset
   * @return {Promise<{count: number, articles: Array<Article>}>}
   */
  async findPage(limit, offset) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES],
      distinct: true
    });
    return {count, articles: rows};
  }

  async findHotArticles(limit) {
    const articles = await this._Article.findAll({
      subQuery: false,
      attributes: [`id`, `title`, `announce`, [Sequelize.fn(`COUNT`, Sequelize.col(`comments.id`)), `commentsCount`]],
      limit,
      include: [
        {
          model: this._Comment,
          as: Alias.COMMENTS,
          attributes: [],
        }
      ],
      order: Sequelize.literal(`"commentsCount" DESC`),
      group: [Sequelize.col(`Article.id`)]
    });

    return articles.map((item) => item.get());
  }

  /**
   * Возвращает статью
   * @param {string} id
   * @return {Promise<Article | null>}
   */
  async findOne(id) {
    const article = await this._Article.findByPk(id, {include: [Alias.CATEGORIES, Alias.COMMENTS]});
    return article ? article.get() : null;
  }

  /**
   * Добавляет новую статью
   * @param {Partial<Article>} data
   * @return {Promise<Article>}
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
   * @return {Promise<Article>}
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
   * @return {Promise<boolean>}
   */
  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });

    return !!deletedRows;
  }
}

module.exports = ArticleService;
