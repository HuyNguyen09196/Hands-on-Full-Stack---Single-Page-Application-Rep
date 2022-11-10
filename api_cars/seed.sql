DROP TABLE IF EXISTS brand CASCADE;
DROP TABLE IF EXISTS cars ;

CREATE TABLE brand (
    brand_id SERIAL ,
    PRIMARY KEY (brand_id),
    name varchar(100),
    country varchar(25)
);
CREATE TABLE cars (
    car_id SERIAL NOT NULL ,
    PRIMARY KEY(car_id),
    name varchar(100),
    type varchar(25),
    color varchar(25),
    year int,
    brand_id integer,
    FOREIGN KEY(brand_id)
    REFERENCES brand(brand_id)ON DELETE CASCADE

);