const {nanoid} = require(`nanoid`);
const {
  MAX_ID_LENGTH
} = require(`../../constants`);

class CommentService {
  /**
   * Возвращает комментарии к статье
   * @param {Array<Article>} articles
   * @param {string} id
   * @return {Array<Comment>}
   */
  findAll(articles, id) {
    const article = articles.find((it) => it.id === id);
    return article.comments;
  }

  /**
   * Добавляет комментарий к статье
   * @param {Article} article
   * @param {any} comment
   * @return {Comment}
   */
  create(article, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
      articleId: article.id,
      articleTitle: article.title,
      createdDate: new Date().toISOString()
    }, comment);

    article.comments.push(newComment);
    return newComment;
  }

  drop(article, commentId) {
    const comment = article.comments.find((item) => item.id === commentId);

    if (!comment) {
      return false;
    }

    article.comments = article.comments.filter((item) => item.id !== commentId);
    return true;
  }
}

module.exports = CommentService;
