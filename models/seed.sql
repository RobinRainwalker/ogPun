DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY,
	userName VARCHAR NOT NULL UNIQUE,
	password_digest VARCHAR NOT NULL
);