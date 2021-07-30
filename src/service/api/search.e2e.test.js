const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const search = require(`./search`);
const DataService = require(`../data-service/search-service`);
const initDB = require(`../lib/init-db`);

const {
  mockArticles,
  mockCategories
} = require(`./mock`);

const {
  HttpCode
} = require(`../../constants`);

const app = express();
app.use(express.json());
const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

beforeAll(async() => {
  await initDB(mockDB, mockArticles, mockCategories);
  search(app, new DataService(mockDB));
})

describe(`API returns article based on search query`, () => {
  let response;
  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Как собрать камни бесконечности`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct id`, () => expect(response.body[0].id).toBe(3));
});

test(`API returns 400 when query string is absent`,
    () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
);
