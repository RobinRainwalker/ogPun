DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS quotes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS groans CASCADE;
DROP TABLE IF EXISTS giggles CASCADE;

CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY,
	username VARCHAR NOT NULL UNIQUE,
	password_digest VARCHAR NOT NULL
);

CREATE TABLE quotes (
	id SERIAL PRIMARY KEY,
	bg_image_url TEXT,
	created_date TIMESTAMP,
	quote TEXT,
	author TEXT
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id),
	quote_id INT REFERENCES quotes(id),
	created_date TIMESTAMP,
	last_modified_date TIMESTAMP,
	pun TEXT
);

CREATE TABLE groans (
	id SERIAL PRIMARY KEY,
	comment_id INT REFERENCES comments(id),
	user_id INT REFERENCES users(id)
);

CREATE TABLE giggles (
	id SERIAL PRIMARY KEY,
	comment_id INT REFERENCES comments(id),
	user_id INT REFERENCES users(id)
);