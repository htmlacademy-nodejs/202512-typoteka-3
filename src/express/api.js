const axios = require(`axios`);

const TIMEOUT = 1000;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  get(url, options = {}) {
    return this._load(url, {...options});
  }

  post(url, data, options = {}) {
    return this._load(url, {
      method: `POST`,
      data,
      ...options
    });
  }

  put(url, data, options = {}) {
    return this._load(url, {
      method: `PUT`,
      data,
      ...options
    });
  }

  delete(url, options = {}) {
    return this._load(url, {
      method: `DELETE`,
      ...options
    });
  }

  /**
   * Отправляет запрос на сервер
   * @param {string} url
   * @param {*} options
   * @return {Promise<N>}
   */
  async _load(url, options = {}) {
    try {
      const response = await this._http.request({url, ...options});
      return response.data;
    } catch (ex) {
      // TODO: Обработка ошибок
      console.error(ex);
      return ex;
    }
  }
}

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;
const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
