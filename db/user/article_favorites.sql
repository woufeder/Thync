DROP TABLE `article_favorites`;
USE restful;
CREATE TABLE article_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    users_id INT,
    articles_id INT,
    FOREIGN KEY (users_id) REFERENCES users(id),
    FOREIGN KEY (articles_id) REFERENCES articles(id)
);

