DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY,
	username VARCHAR NOT NULL UNIQUE,
	password_digest VARCHAR NOT NULL
);