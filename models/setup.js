const pgp = require('pg-promise')();

const db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'express_passport'
});

module.exports = db;