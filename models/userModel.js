const bcrypt = require('bcryptjs');
const db = require('../models/setup');

const User = {};

function createUser (user) {
	const password = bcrypt.hashSync(user.password, 10);
	console.log('in the model!!!!', user.name, password);
	return db.oneOrNone(`
		INSERT INTO users
		(username, password_digest)
		VALUES
		($1, $2)
		RETURNING *`,
		[user.name, password]
	);
	// console.log('creating user');
};

function deleteUserById (body) {
	// console.log('deleting user')
	return db.oneOrNone(`
		DELETE FROM users
		WHERE id = $1`, [body.user.id]);
};

function updateUserById (body) {
	// console.log('updating user');
	const update = body.update;
	const password = bcrypt.hashSync(update.password, 10);
    return db.one(`
      UPDATE students SET
      username = $1,
      password_digest = $2,
      WHERE id = $3
      returning *;`,
      [update.username,
      password,
      id]
  );
};

function findUserByUsername (username) {
	// console.log('findByUserName fnctn saying hello')
	return db.oneOrNone(`
		SELECT * 
		From users
		WHERE username = $1;`,
		[username]
	);
	// console.log('finding user by username');
};

module.exports = { createUser, findUserByUsername, deleteUserById, updateUserById,};