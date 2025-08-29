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

