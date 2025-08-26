CREATE DATABASE restful;

use restful;

CREATE TABLE user_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coupon_id INT NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    attr ENUM('force', 'manual') NOT NULL DEFAULT 'manual'
);

SELECT 
  uc.id AS user_coupon_id,
  uc.user_id,
  uc.coupon_id,
  uc.is_used,
  uc.used_at,
  uc.created_at AS assigned_at,
  c.code,
  c.`desc`,
  c.start_at,
  c.expires_at,
  c.is_active,
  c.is_valid
FROM user_coupons uc
JOIN coupon c ON uc.coupon_id = c.id
WHERE uc.user_id = 113;