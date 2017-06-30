const bcrypt = require('bcryptjs');
const db = require('../models/setup');

const User = {};

function create (user) {
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

function findByUserName (username) {
	console.log('findByUserName fnctn saying hello')
	return db.oneOrNone(`
		SELECT * 
		From users
		WHERE username = $1;`,
		[username]
	);
	// console.log('finding user by username');
};

module.exports = { create, findByUserName };