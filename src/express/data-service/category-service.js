class CategoryService {
  /**
   * @param {API} api
   */
  constructor(api) {
    this._api = api;
  }

  /**
   * Получает и возвращает категории
   * @param {boolean} needCount
   * @return {Promise<Array<Category>>}
   */
  async getAll(needCount) {
    return this._api.get(`/category`, {params: {needCount}});
  }
}

module.exports = CategoryService;
