/**
 * @typedef {*} Comment
 */

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  /**
   * Возвращает комментарии к статье
   * @param {number} articleId
   * @return {Array<Comment>}
   */
  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  /**
   * Добавляет комментарий к статье
   * @param {number} articleId
   * @param {Partial<Comment>} comment
   * @return {Comment}
   */
  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  /**
   * Удаляет комментарий
   * @param {number} id
   * @return {boolean}
   */
  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
