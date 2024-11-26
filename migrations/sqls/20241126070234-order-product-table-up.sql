CREATE TABLE order_product (
    id SERIAL PRIMARY KEY,
    id_order INTEGER,
    id_product INTEGER,
    quantity INTEGER
);