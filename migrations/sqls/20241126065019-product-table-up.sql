CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    price NUMERIC(20,2),
    category VARCHAR(255)
);