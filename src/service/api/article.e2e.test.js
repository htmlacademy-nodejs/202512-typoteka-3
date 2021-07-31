const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const article = require(`./article`);
const {
  ArticleService,
  CommentService
} = require(`../data-service/index`);
const initDB = require(`../lib/init-db`);
const {
  mockArticles,
  mockCategories
} = require(`./mock`);

const {
  HttpCode
} = require(`../../constants`);

const newArticle = {
  title: `Новая публикация Тест`,
  announce: `Текст анонса`,
  fullText: `Полный текст`,
  picture: ``,
  categories: [6, 2],
};
/**
 *
 * @return {Promise<Express>}
 */
const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, mockArticles, mockCategories);
  const app = express();
  app.use(express.json());
  article(app, new ArticleService(mockDB), new CommentService(mockDB));
  return app;
};

/**
 * ARTICLES
 */
describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 3 articles`, () => expect(response.body.length).toBe(3));

  test(`First article's id equals 1`, () => expect(response.body[0].id).toBe(1));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code ${HttpCode.OK}`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Как достигнуть успеха не вставая с кресла"`, () => expect(response.body.title).toBe(`Как достигнуть успеха не вставая с кресла`));
});

describe(`API correctly deletes an article`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code ${HttpCode.SUCCESS}`, () => expect(response.statusCode).toBe(HttpCode.SUCCESS));

  test(`Articles count is 2 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(mockArticles.length - 1))
  );
});

describe(`API creates an articles if data is valid`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code ${HttpCode.CREATED}`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(mockArticles.length + 1)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  test(`Without any required property response code is ${HttpCode.BAD_REQUEST}`, async () => {
    const app = await createAPI();

    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
  });

  test(`Status code ${HttpCode.OK}`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(newArticle.title)));
});

describe(`Negative cases for changing an article`, () => {
  let app;

  beforeAll(async() => {
    app = await createAPI();
  })

  test(`API returns status code ${HttpCode.NOT_FOUND} when trying to change non-existent Article`, async () => {
    return request(app)
      .put(`/articles/4`)
      .send(newArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code ${HttpCode.BAD_REQUEST} when trying to change an Article with invalid data`, () => {
    const invalidArticle = {...newArticle};
    delete invalidArticle.title;

    return request(app)
      .put(`/articles/1`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/235`)
    .expect(HttpCode.NOT_FOUND);
});

/**
 * COMMENTS
 */

describe(`API returns comments for a article with given id`, () => {
  const commentsLength = mockArticles[0].comments.length;
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1/comments`);
  });

  test(`Status code ${HttpCode.OK}`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`First comment id equals 1`, () => expect(response.body[0].id).toBe(1));

  test(`Returns a list of ${commentsLength} comments`, () => expect(response.body.length).toBe(commentsLength));
});

test(`API refuses return a comment not non-existent article and returns status code ${HttpCode.NOT_FOUND}`, async () => {
  const app = await createAPI();

  return request(app)
    .get(`/articles/11/comments`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment not non-existent article and returns status code ${HttpCode.NOT_FOUND}`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/11/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes an comment`, () => {
  const commentsLength = mockArticles[0].comments.length;
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code ${HttpCode.SUCCESS}`, () => expect(response.statusCode).toBe(HttpCode.SUCCESS));

  test(`Returns a list of ${commentsLength} comments`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(commentsLength - 1))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();
  return request(app)
    .delete(`/articles/1/comments/123`)
    .expect(HttpCode.NOT_FOUND);
});
