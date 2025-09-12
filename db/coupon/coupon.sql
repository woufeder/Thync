
use restful;

DROP TABLE `coupon`;

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

ALTER TABLE coupon
ADD COLUMN is_valid TINYINT NOT NULL DEFAULT 1,
ADD COLUMN is_active TINYINT NOT NULL DEFAULT 1;

