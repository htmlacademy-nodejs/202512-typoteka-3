const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const ArticleService = require(`../../data-service/article-service`);
const CommentService = require(`../../data-service/comment-service`);

const {
  HttpCode
} = require(`../../../constants`);

const mockData = [
  {
    id: `svzCQE`,
    title: `Лучшие рок-музыканты 20-века`,
    createdDate: `2021-03-24T05:55:14.521Z`,
    picture: `forest@1x.jpg`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    category: [
      `За жизнь`,
      `Разное`,
      `Кино`,
      `Деревья`
    ],
    comments: [
      {
        articleId: `svzCQE`,
        articleTitle: `Лучшие рок-музыканты 20-века`,
        id: `ZwqjTY`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        author: `Андрей Сидоров`
      },
      {
        articleId: `svzCQE`,
        articleTitle: `Лучшие рок-музыканты 20-века`,
        id: `uzJrxT`,
        text: `Согласен с автором! Совсем немного...`,
        author: `Иван Петров`
      },
      {
        articleId: `svzCQE`,
        articleTitle: `Лучшие рок-музыканты 20-века`,
        id: `LhON2V`,
        text: `Совсем немного...  Плюсую, но слишком много буквы!`,
        author: `Максим Иванов`
      },
      {
        articleId: `svzCQE`,
        articleTitle: `Лучшие рок-музыканты 20-века`,
        id: `mDZJV0`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        author: `Максим Иванов`
      }
    ]
  },
  {
    id: `_iUhgT`,
    title: `Как перестать беспокоиться и начать жить`,
    createdDate: `2021-03-26T14:24:52.709Z`,
    picture: `skyscrapper@1x.jpg`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь.  Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    category: [
      `Без рамки`,
      `Железо`
    ],
    comments: [
      {
        articleId: `_iUhgT`,
        articleTitle: `Как перестать беспокоиться и начать жить`,
        id: `iJ50av`,
        text: `Хочу такую же футболку :-) Совсем немного... Это где ж такие красоты?`,
        author: `Петр Петров`
      }
    ]
  },
  {
    id: `5t-zTB`,
    title: `Лучшие рок-музыканты 20-века`,
    createdDate: `2021-03-18T12:47:40.934Z`,
    picture: `skyscrapper@1x.jpg`,
    announce: `Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Простые ежедневные упражнения помогут достичь успеха. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    category: [
      `IT`,
      `Музыка`,
      `Деревья`
    ],
    comments: [
      {
        articleId: `5t-zTB`,
        articleTitle: `Лучшие рок-музыканты 20-века`,
        id: `yqjeBA`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
        author: ``
      },
      {
        articleId: `5t-zTB`,
        articleTitle: `Лучшие рок-музыканты 20-века`,
        id: `w9c7-d`,
        text: `Планируете записать видосик на эту тему?`,
        author: `Иван Петров`
      }
    ]
  },
  {
    id: `fFUlBN`,
    title: `Как начать программировать`,
    createdDate: `2021-03-30T06:51:08.210Z`,
    picture: ``,
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения.  Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов.`,
    category: [
      `Железо`,
      `IT`,
      `Разное`,
      `Программирование`,
      `За жизнь`,
      `Музыка`,
      `Кино`
    ],
    comments: [
      {
        articleId: `fFUlBN`,
        articleTitle: `Как начать программировать`,
        id: `58cn6W`,
        text: `Хочу такую же футболку :-) Совсем немного...`,
        author: `Петр Петров`
      },
      {
        articleId: `fFUlBN`,
        articleTitle: `Как начать программировать`,
        id: `6MGmVX`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        author: `Петр Петров`
      },
      {
        articleId: `fFUlBN`,
        articleTitle: `Как начать программировать`,
        id: `YMHx5h`,
        text: ``,
        author: `Максим Иванов`
      }
    ]
  },
  {
    id: `gZpvef`,
    title: `Как перестать беспокоиться и начать жить`,
    createdDate: `2021-03-16T01:30:36.751Z`,
    picture: `skyscrapper@1x.jpg`,
    announce: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.  Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Ёлки — это не просто красивое дерево. Это прочная древесина. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    category: [
      `Железо`,
      `Разное`,
      `Деревья`,
      `Программирование`,
      `Музыка`,
      `IT`,
      `Кино`
    ],
    comments: [
      {
        articleId: `gZpvef`,
        articleTitle: `Как перестать беспокоиться и начать жить`,
        id: `NNeNCn`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Хочу такую же футболку :-)`,
        author: `Максим Иванов`
      }
    ]
  }
];

const nonExistentId = `NOEXST`;
const newArticle = {
  title: `Новая публикация Тест`,
  announce: `Текст анонса`,
  fullText: `Полный текст`,
  category: [`Жизнь`]
};

const existentId = `fFUlBN`;
const commentId = mockData.find((it) => it.id === existentId).comments[0].id;

/**
 *
 * @return {Express}
 */
const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new ArticleService(cloneData), new CommentService());
  return app;
};

/**
 * ARTICLES
 */

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals ${mockData[0].id}`, () => expect(response.body[0].id).toBe(mockData[0].id));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${existentId}`);
  });

  test(`Status code ${HttpCode.OK}`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Как начать программировать"`, () => expect(response.body.title).toBe(`Как начать программировать`));
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${existentId}`);
  });

  test(`Status code ${HttpCode.SUCCESS}`, () => expect(response.statusCode).toBe(HttpCode.SUCCESS));

  test(`Articles count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(mockData.length - 1))
  );
});

describe(`API creates an articles if data is valid`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code ${HttpCode.CREATED}`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(mockData.length + 1)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const app = createAPI();

  test(`Without any required property response code is ${HttpCode.BAD_REQUEST}`, async () => {
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
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/${existentId}`)
      .send(newArticle);
  });

  test(`Status code ${HttpCode.OK}`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/fFUlBN`)
    .expect((res) => expect(res.body.title).toBe(newArticle.title)));
});

describe(`Negative cases for changing an article`, () => {
  test(`API returns status code ${HttpCode.NOT_FOUND} when trying to change non-existent Article`, () => {
    const app = createAPI();

    return request(app)
      .put(`/articles/${nonExistentId}`)
      .send(newArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status code ${HttpCode.BAD_REQUEST} when trying to change an Article with invalid data`, () => {
    const app = createAPI();

    const invalidArticle = {...newArticle};
    delete invalidArticle.title;

    return request(app)
      .put(`/articles/${existentId}`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/${nonExistentId}`)
    .expect(HttpCode.NOT_FOUND);
});

/**
 * COMMENTS
 */

describe(`API returns comments for a article with given id`, () => {
  const app = createAPI();
  const commentsLength = mockData.find((it) => it.id === existentId).comments.length;
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/${existentId}/comments`);
  });

  test(`Status code ${HttpCode.OK}`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`First comment id equals ${commentId}`, () => expect(response.body[0].id).toBe(commentId));

  test(`Returns a list of ${commentsLength} comments`, () => expect(response.body.length).toBe(commentsLength));
});

test(`API refuses return a comment not non-existent article and returns status code ${HttpCode.NOT_FOUND}`, () => {
  const app = createAPI();

  return request(app)
    .get(`/articles/${nonExistentId}/comments`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment not non-existent article and returns status code ${HttpCode.NOT_FOUND}`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/${nonExistentId}/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes an comment`, () => {
  const app = createAPI();
  const commentsLength = mockData.find((it) => it.id === existentId).comments.length;
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/${existentId}/comments/${commentId}`);
  });

  test(`Status code ${HttpCode.SUCCESS}`, () => expect(response.statusCode).toBe(HttpCode.SUCCESS));

  test(`Returns a list of ${commentsLength} comments`, () => request(app)
    .get(`/articles/${existentId}/comments`)
    .expect((res) => expect(res.body.length).toBe(commentsLength - 1))
  );
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/${existentId}/comments/${nonExistentId}`)
    .expect(HttpCode.NOT_FOUND);
});
