DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS article_categories CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE users(
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      first_name varchar(255) NOT NULL,
      last_name varchar(255) NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      password_hash varchar(255) NOT NULL,
      avatar varchar(50)
);

CREATE TABLE articles(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(255) NOT NULL,
    picture varchar(50),
    announce text NOT NULL,
    full_text text NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    user_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
                     ON DELETE NO ACTION
);

CREATE TABLE categories(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(255) NOT NULL UNIQUE
);

CREATE TABLE article_categories(
    article_id integer NOT NULL,
    category_id integer NOT NULL,
                               PRIMARY KEY (article_id, category_id),
                               FOREIGN KEY (article_id) REFERENCES articles(id),
                               FOREIGN KEY (category_id) REFERENCES categories(id)
                               ON DELETE CASCADE
);

CREATE TABLE comments(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    article_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    text text NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id)
                     ON DELETE CASCADE
);


CREATE INDEX ON articles (title);
