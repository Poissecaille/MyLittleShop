-- CREATE USER postgres with encrypted password 'alpha';
-- CREATE DATABASE shop;
GRANT ALL PRIVILEGES ON DATABASE shop TO postgres;
CREATE TYPE role AS ENUM('buyer', 'seller', 'admin');
CREATE TABLE "user"(
  id serial PRIMARY KEY,
  email VARCHAR (50) UNIQUE NOT NULL,
  username VARCHAR (50) UNIQUE NOT NULL,
  firstName VARCHAR (50) NOT NULL,
  lastName VARCHAR (50) NOT NULL,
  password VARCHAR (50) NOT NULL,
  birthDate DATE NOT NULL DEFAULT CURRENT_DATE,
  role role NOT NULL DEFAULT 'buyer',
  activated BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATE NOT NULL DEFAULT CURRENT_DATE,
  updatedAt DATE NOT NULL DEFAULT CURRENT_DATE
);
INSERT INTO
  "user" (
    email,
    username,
    firstName,
    lastName,
    password,
    birthDate,
    role,
    activated,
    createdAt,
    updatedAt
  )
VALUES
  (
    'admin@hotmail.fr',
    'admin',
    'admin',
    'admin',
    'password',
    '01/01/1970',
    'admin',
    TRUE,
    '2022-03-22 14:34:47.000+0100',
    '2022-03-22 14:34:47.000+0100'
  ),(
    'seller@hotmail.fr',
    'seller',
    'seller',
    'seller',
    'password',
    '01/01/1970',
    'seller',
    TRUE,
    '2022-03-22 14:34:47.000+0100',
    '2022-03-22 14:34:47.000+0100'
  );