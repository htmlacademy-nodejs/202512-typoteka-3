/* список всех категорий (идентификатор, наименование категории); */
SELECT * FROM categories;

/* список категорий для которых создана минимум одна публикация (идентификатор, наименование категории); */
SELECT id, title FROM categories
                        JOIN article_categories
                            ON id = category_id
GROUP BY id;

/* список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории); */
SELECT id, title, count(article_id) FROM categories
                                             LEFT JOIN article_categories
                                                       ON id = category_id
GROUP BY id;

/* cписок публикаций (идентификатор публикации, заголовок публикации,
   анонс публикации, дата публикации, имя и фамилия автора,
   контактный email, количество комментариев, наименование категорий).
   Сначала свежие публикации;
 */
SELECT a.id, a.title, a.announce, a.created_at,
       count(DISTINCT com.id) comments_count,
       STRING_AGG(DISTINCT c.title, ', ') category_list,
       u.first_name,
       u.last_name, u.email
FROM articles a
         LEFT JOIN comments com ON com.article_id = a.id
         JOIN article_categories ac ON a.id = ac.article_id
         JOIN categories c ON ac.category_id = c.id
         JOIN users u ON u.id = a.user_id
GROUP BY a.id, a.created_at, u.id
ORDER BY a.created_at DESC;

/* Получить полную информацию определённой публикации
   (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации,
   путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий); */

SELECT a.id, a.title, a.announce, a.created_at,
       count(DISTINCT com.id) comments_count,
       STRING_AGG(DISTINCT c.title, ', ') category_list,
       u.first_name,
       u.last_name, u.email
FROM articles a
         LEFT JOIN comments com ON com.article_id = a.id
         JOIN article_categories ac ON a.id = ac.article_id
         JOIN categories c ON ac.category_id = c.id
         JOIN users u ON u.id = a.user_id
WHERE a.id = 1
GROUP BY a.id, u.id;

/* Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария); */
SELECT c.id, c.article_id, u.last_name, u.first_name, c.text, c.created_at
FROM comments c
         JOIN users u ON c.user_id = u.id
ORDER BY created_at DESC
LIMIT 5;

/* Получить список комментариев для определённой публикации
   (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария).
   Сначала новые комментарии; */

SELECT c.id, c.article_id, u.last_name, u.first_name, c.text, c.created_at
FROM comments c
         JOIN users u ON c.user_id = u.id
WHERE c.article_id = 1
ORDER BY created_at DESC;

/*
    Обновить заголовок определённой публикации на «Как я встретил Новый год»;
*/
UPDATE articles
SET title = 'Тестовый заголовок!'
WHERE id = 1;

