const bcrypt = require('bcryptjs');
const db = require('./setup');

const User = {};

function create (user) {
	const password = bcrypt.hashSync(user.password, 10);

	return db.oneOrNone(`
		INSERT INTO users
		(userName, password_digest)
		VALUES
		($1, $2)
		RETURNING *;`
		[user.userName, password]
	);
	console.log('creating user');
};

function findByUserName (name) {
	return db.oneOrNone(`
		SELECT * 
		From users
		WHERE userName = $1;`,
		[userName]
	);
	console.log('finding user by username');
};

module.exports = { create, findByUserName };