-- This script requires MySQL 5.7.6+
CREATE DATABASE IF NOT EXISTS irclogs;
CREATE USER IF NOT EXISTS 'thelounge'@'localhost' IDENTIFIED BY 'WLJg123r0823r@!#RPI!H@RQ';
GRANT ALL ON irclogs.* to thelounge@'localhost';
FLUSH PRIVILEGES;
USE irclogs;

CREATE TABLE logs (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    host VARCHAR(64),
    channel VARCHAR(30),
    message VARCHAR(600),
    datetime TIMESTAMP
);
