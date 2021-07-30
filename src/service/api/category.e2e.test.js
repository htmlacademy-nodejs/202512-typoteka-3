const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const category = require(`./category`);
const DataService = require(`../data-service/category-service`);
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
  category(app, new DataService(mockDB));
})

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 9 categories`, () => expect(response.body.length).toBe(9));
  test(`Category names are ${mockCategories.join(', ')}`, () => expect(response.body.map((it) => it.title)).toEqual(expect.arrayContaining(mockCategories)));
});

