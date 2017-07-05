const pgp = require('pg-promise')();

let types = pgp.pg.types;

types.setTypeParser(1114, str => {return new Date(Date.parse(str + "+0000"))});

const db = pgp(process.env.DATABASE_URL || 
	'postgres://robinrainwalker@localhost:5432/ogpun');

module.exports = db;