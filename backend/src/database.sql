-- Used command in postgreSQL
CREATE DATABASE api;

CREATE TABLE sample_audit
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(40) UNIQUE NOT NULL,
    hand_count int,
    machine_count int,
    count_date DATE DEFAULT CURRENT_DATE
);

INSERT INTO sample_audit
    (name, hand_count, machine_count)
VALUES
    ('Wake 01', 50, 60),
    ('Wake 02', 120, 120)
