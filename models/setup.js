const pgp = require('pg-promise')();

const db = pgp(process.env.DATABASE_URL || 
	'postgres://robinrainwalker@localhost:5432/ogpun');

module.exports = db;