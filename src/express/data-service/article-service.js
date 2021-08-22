const ARTICLES_PER_PAGE = 8;
const HOT_ARTICLES_COUNT = 4;

class ArticleService {
  /**
   * @param {API} api
   */
  constructor(api) {
    this._api = api;
  }

  /**
   * Получает и возвращает список статей
   * @param {boolean} comments
   * @param {number} offset
   * @param {number} limit
   * @return {Promise<Array<Article>>}
   */
  async getAll(comments, offset, limit) {
    return this._api.get(`/articles`, {params: {offset, limit, comments}});
  }

  /**
   * Получает и возвращает список статей на страницу
   * @param {number} page
   * @param {boolean} comments
   * @return {Promise<Array<Article>>}
   */
  async getAllByPage(page = 1, comments) {
    const limit = ARTICLES_PER_PAGE;
    const offset = (page - 1) * limit;

    return this.getAll(comments, offset, limit);
  }

  /**
   * Возвращает самые комментируемые статьи
   * @return {Promise<Array<{id: number, title: string, announce: string, commentsCount: number, categories: number[] }>>}
   */
  async getHotArticles() {
    const limit = HOT_ARTICLES_COUNT;

    return this._api.get(`/articles/hot`, {params: {limit}});
  }

  /**
   * Получает и возвращает статью
   * @param {string} id
   * @return {Promise<Article>}
   */
  async getOne(id) {
    return this._api.get(`/articles/${id}`);
  }

  /**
   * Получает и возвращает статьи, имеющие вхождение подстроки query
   * @param {string} query
   * @return {Promise<Article>}
   */
  async getAllBySearchQuery(query) {
    return this._api.get(`/search`, {params: {query}});
  }

  /**
   * Добавляет новую статью и возвращает её
   * @param {*} data
   * @return {Promise<Article>}
   */
  async createOne(data) {
    return this._api.post(`/articles`, data);
  }

  /**
   * Изменяет статью под определенным id и возвращает её
   * @param {string} id
   * @param {*} data
   * @return {Promise<Article>}
   */
  async changeOne(id, data) {
    return this._api.put(`/articles/${id}`, data);
  }

  /**
   * Удаляет статью с определенным id
   * @param {string} id
   * @return {Promise<*>}
   */
  async removeOne(id) {
    return this._api.delete(`/articles/${id}`);
  }


  /**
   * @param {{title: string, category: Array<number>, announce: string, fullText: string}} data
   * @param {File} file
   * @return {{fullText, categories, title, picture: string, announce}}
   */
  getArticleData({title, category, announce, fullText}, file) {
    return {
      picture: file ? file.filename : ``,
      title,
      categories: category,
      announce,
      fullText
    };
  }

  /**
   * @param {number} articleCount
   * @return {number}
   */
  calculatePages(articleCount) {
    return articleCount > ARTICLES_PER_PAGE ? Math.ceil(articleCount / ARTICLES_PER_PAGE) : 1;
  }
}

module.exports = ArticleService;
