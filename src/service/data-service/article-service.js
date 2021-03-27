const {nanoid} = require(`nanoid`);
const {
  MAX_ID_LENGTH
} = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  /**
   * Возвращает все статьи
   * @return {Array<Article>}
   */
  findAll() {
    return this._articles;
  }

  /**
   * Возвращает статью
   * @param {string} id
   * @return {Article}
   */
  findOne(id) {
    return this._articles.find((article) => article.id === id);
  }

  /**
   * Добавляет новую статью
   * @param {any} article
   * @return {Article}
   */
  create(article) {
    const newArticle = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
      createdDate: new Date().toISOString(),
      comments: []
    }, article);

    this._articles.push(newArticle);
    return newArticle;
  }

  /**
   * Редактирует статью
   * @param {string} id
   * @param {Article} article
   * @return {Article}
   */
  update(id, article) {
    const oldArticle = this._articles.find((it) => it.id === id);

    return Object.assign(oldArticle, article);
  }

  /**
   * Удаляет статью
   * @param {string} id
   * @return {boolean}
   */
  drop(id) {
    const article = this._articles.find((it) => it.id === id);

    if (!article) {
      return false;
    }

    this._articles = this._articles.filter((it) => it.id !== id);
    return true;
  }
}

module.exports = ArticleService;
