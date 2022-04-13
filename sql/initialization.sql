CREATE USER postgres with encrypted password 'alpha';
CREATE DATABASE shop;
GRANT ALL PRIVILEGES ON DATABASE shop TO postgres;
