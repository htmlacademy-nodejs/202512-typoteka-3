const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle
} = require(`../../utils`);
const {
  ExitCode
} = require(`../../constants`);
const chalk = require(`chalk`);


const FILE_NAME = `mocks.json`;

const ANNOUNCE_RESTRICT = 5;

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const PublicationsRestrict = {
  MIN: 1,
  MAX: 1000
};

/**
 * Генерирует дату публикации
 * @return {string}
 */
const getDate = () => {
  const maxMonthGap = 2;

  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - getRandomInt(0, maxMonthGap));
  const diff = Date.now() - minDate.valueOf();
  const publicationDate = new Date(Date.now() - getRandomInt(0, diff));

  return publicationDate.toISOString();
};

/**
 * Генерирует моки публикаций
 * @param {number} count
 * @return {{ title: string, createdDate: string, announce: string, fullText: string, category: string[] }[]}
 */
const generatePublications = (count) => (
  Array(count).fill(``).map(() => ({
    title: shuffle(TITLES)[getRandomInt(0, TITLES.length - 1)],
    createdDate: getDate(),
    announce: shuffle(SENTENCES).slice(0, getRandomInt(1, ANNOUNCE_RESTRICT)).join(` `),
    fullText: shuffle(SENTENCES).slice(0, getRandomInt(0, SENTENCES.length)).join(` `),
    category: shuffle(CATEGORIES).slice(0, getRandomInt(1, CATEGORIES.length))
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    let countPublications = Number.parseInt(count, 10) || PublicationsRestrict.MIN;

    if (countPublications > PublicationsRestrict.MAX) {
      console.info(`Notify: max publications count ${PublicationsRestrict.MAX}`);
      countPublications = PublicationsRestrict.MAX;
    }

    const content = JSON.stringify(generatePublications(countPublications));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created`));
      process.exit(ExitCode.success);
    } catch (ex) {
      console.error(chalk.red(`Can't write data to file : ${ex}`));
      process.exit(ExitCode.exception);
    }
  }
};
