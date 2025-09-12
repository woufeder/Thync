-- Active: 1757401082402@@127.0.0.1@3306@restful
use restful;

CREATE table coupon (
    id int PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10),
    `desc` VARCHAR(100),
    type TINYINT,
    value INT,
    min INT,
    start_at DATETIME,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT * FROM coupon;

ALTER TABLE coupon
ADD COLUMN is_valid TINYINT NOT NULL DEFAULT 1,
ADD COLUMN is_active TINYINT NOT NULL DEFAULT 1;

SELECT
    id,
    code,
    is_active,
    is_valid,
    expires_at
FROM coupon
WHERE (
        is_valid = 0
        OR expires_at < NOW()
    )
    AND is_active = 1;

SHOW COLUMNS FROM coupon LIKE 'expires_at';

INSERT INTO user_coupons (user_id, coupon_id, attr)
VALUES 
(115, 1, 'manual'),
(115, 2, 'manual'),
(115, 3, 'manual');

SHOW DATABASES;

SELECT * FROM user_coupons WHERE user_id = 115;

INSERT INTO user_coupons (user_id, coupon_id, attr)
VALUES 
(1, 4, 'manual'),
(1, 5, 'manual'),
(1, 6, 'manual');

SELECT * FROM user_coupons WHERE user_id = 1;

SELECT * FROM coupon WHERE id IN (4,5,6);

// 查詢使用者可用的優惠券

SELECT * FROM user_coupons WHERE user_id = 122;