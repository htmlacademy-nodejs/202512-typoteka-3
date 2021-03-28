class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  /**
   * Возвращает статьи, заголовки которых имеют вхождение query
   * @param {string} query
   * @return {Array<Article>}
   */
  findAll(query) {
    return this._articles.filter((article) => article.title.includes(query));
  }
}

module.exports = SearchService;
