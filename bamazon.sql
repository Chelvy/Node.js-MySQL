DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Ch5lv25@07';

CREATE TABLE products
(
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity DECIMAL(10,0) NULL,
  PRIMARY KEY (item_id),
  UNIQUE (product_name)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Colgate", "Healthcare", 5.95, 5000.00), ("Milk", "Food", 4.55, 595.00), ("Tesla", "Cars", 65978.99, 350.00),  ("Gasoil", "Energy", 2.89, 3726.00), ("Credit Card", "Bank & Finance", 49.99, 79000.00), ("Pants Jean", "Cloths", 199.95, 520.00), ("beers", "Beverage", 6.45, 459876.00), ("Alexa", "Hi-Tech", 485.95, 9545.00);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Iphone", "Telecom", 1095.99, 108000.00);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bible", "Bookstore", 2.99, 1590.00);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Air Jordan", "Sport wear", 399.95, 43495.00);

SELECT * FROM products;