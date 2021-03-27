class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  /** Возвращает список категорий
   * @return {Array<string>}
   */
  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      article.categories.forEach((category) => {
        acc.add(category);
      });
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
