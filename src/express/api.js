const axios = require(`axios`);

const TIMEOUT = 1000;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  /**
   * Отправляет запрос на сервер
   * @param {string} url
   * @param {*} options
   * @return {Promise<*>}
   * @private
   */
  async _load(url, options = {}) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  /**
   * Получает и возвращает список статей
   * @return {Promise<Array<Article>>}
   */
  async getArticles() {
    return this._load(`/articles`);
  }

  /**
   * Получает и возвращает статью
   * @param {string} id
   * @return {Promise<Article>}
   */
  async getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  /**
   * Получает и возвращает статьи, имеющие вхождение подстроки query
   * @param {string} query
   * @return {Promise<Article>}
   */
  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  /**
   * Получает и возвращает категории
   * @return {Promise<Category>}
   */
  async getCategories() {
    return this._load(`/category`);
  }

  /**
   * Добавляет новую статью и возвращает её
   * @param {*} data
   * @return {Promise<Article>}
   */
  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  /**
   * Изменяет статью под определенным id и возвращает её
   * @param {string} id
   * @param {*} data
   * @return {Promise<Article>}
   */
  async changeArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }

  /**
   * Удаляет статью с определенным id
   * @param {string} id
   * @return {Promise<*>}
   */
  async removeArticle(id) {
    return this._load(`/articles${id}`, {
      method: `DELETE`
    });
  }
}

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;
const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
