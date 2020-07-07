DROP DATABASE IF EXISTS great_bay_db;

CREATE DATABASE great_bay_db;

USE great_bay_db;

CREATE TABLE items (
  id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    bid INT,
  PRIMARY KEY (id)
);