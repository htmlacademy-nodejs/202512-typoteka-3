const LIMIT_LAST_COMMENT = 4;

class CommentService {
  /**
   * @param {API} api
   */
  constructor(api) {
    this._api = api;
  }

  /**
   * Возвращает комментарии ко всем статьям пользователя
   * @return {Promise<Array<Comment>>}
   */
  async getAll() {
    // TODO: комментарии ко всем статьям пользователя
    return [];
  }

  /**
   * Возвращает комментарии ко всем статьям пользователя
   * @return {Promise<Array<Comment>>}
   */
  async getLast() {
    return this._api.get(`/comment/last`, {params: {limit: LIMIT_LAST_COMMENT}});
  }
}

module.exports = CommentService;
