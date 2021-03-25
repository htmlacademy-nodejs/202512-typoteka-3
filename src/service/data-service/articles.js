const {nanoid} = require(`nanoid`);
const {
  MAX_ID_LENGTH
} = require(`../../constants`);

class ArticlesService {
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
   * @param {Article} article
   * @return {Article}
   */
  create(article) {
    const newArticle = Object.assign({id: nanoid(MAX_ID_LENGTH), comments: []}, article);

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
   * @return {(Article | null)}
   */
  drop(id) {
    const article = this._articles.find((it) => it.id === id);

    if (article) {
      return null;
    }

    this._articles = this._articles.filter((it) => it.id !== id);
    return article;
  }
}

module.exports = ArticlesService;
