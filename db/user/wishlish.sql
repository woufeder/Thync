DROP TABLE `wishlist`;
USE restful;
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    users_id INT,
    products_id INT,
    FOREIGN KEY (users_id) REFERENCES users(id),
    FOREIGN KEY (products_id) REFERENCES products(id)
);
SELECT * FROM wishlist WHERE users_id = 96;
SELECT w.*, p.*, pi.file
FROM wishlist w
JOIN products p ON w.products_id = p.id
LEFT JOIN products_imgs pi ON p.id = pi.product_id
WHERE w.users_id = 96;

