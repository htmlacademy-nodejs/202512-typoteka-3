const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const comment = require(`./comment`);
const {CommentService} = require(`../data-service/index`);
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
  comment(app, new CommentService(mockDB));
})

describe(`API returns comments list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/comment`);
  });

  test.todo(`Status code 200`);
});

describe(`API returns last comments`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/comment/last?limit=3`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`API should return last 3 comments`, () => expect(response.body.length).toBe(3));
});
