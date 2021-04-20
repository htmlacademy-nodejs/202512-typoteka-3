class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  /** Возвращает список категорий
   * @return {Array<string>}
   */
  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      article.category.forEach((category) => {
        acc[category.id] = category;
      });
      return acc;
    }, {});

    return Object.values(categories);
  }
}

module.exports = CategoryService;
