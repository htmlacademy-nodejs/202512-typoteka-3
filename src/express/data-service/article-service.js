const Quantity = {
  ARTICLES_HOT: 4,
  COMMENT_LAST: 3
};

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
   * @return {Promise<Array<Article>>}
   */
  async getAll({comments}) {
    return this._api.get(`/articles`, {params: {comments}});
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
   * Получает данные для создания/обновления статьи из объекта запроса
   * @param {Request} req
   * @return { {picture: string, title: string, categories: string[], announce: string, fullText: string} }
   */
  getArticleData(req) {
    const {body, file} = req;

    return {
      picture: file ? file.filename : ``,
      title: body.title,
      categories: body.category,
      announce: body.announce,
      fullText: body.fullText
    };
  }

  /**
   * Возвращает самые обсуждаемые статьи
   * @param {Array<Article>} articles
   * @return {Array<Article>}
   */
  getHotArticles(articles) {
    return articles
      .slice(0)
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, Quantity.ARTICLES_HOT);
  }

  /**
   * Возвращает последние комментарии
   * @param {Array<Article>} articles
   * @return {Array<Comment>}
   */
  getLastComments(articles) {
    return articles
      .map((article) => article.comments)
      .flat()
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, Quantity.COMMENT_LAST);
  }
}

module.exports = ArticleService;
