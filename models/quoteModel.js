const db = require('../models/setup');
const moment = require('moment');

const Quote = {};

function createQuote(body) {
    console.log('creating quote', body);
    const utc = moment(new Date()).unix();
    const utcTimestamp = moment.unix(utc).format('YYYY-MM-DD HH:mm:ss');
    console.log(utcTimestamp);
    return db.oneOrNone(`
    INSERT INTO quotes
    (bg_image_url, created_date, quote, author)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *;`, [body.bgImgSrc, utcTimestamp, body.quoteText, body.author]);
};

function deleteQuoteById(body) {
    return db.oneOrNone(`
    DELETE FROM quotes
    WHERE id = $1;`, [body.quoteId]);
};

function updateQuoteById(body) {
    return db.one(`
      UPDATE quotes SET
      quote = $1,
      author = $2,
      bg_image_url = $3
      WHERE id = $4
      returning *;`, [
      body.quoteText, body.author, body.bgImgSrc, body.quoteId
    ]);
};

function getQuoteById(body) {
    return db.oneOrNone(`
    SELECT * 
    FROM quotes
    WHERE id = $1;`, [body.quoteId]);
};

function getAllQuotes(body) {
    console.log('getAllQuotes')
    return db.any(`
    SELECT * 
    FROM quotes;`);
    // WHERE created_date >= $1 AND created_date < $1 + interval '1 day';`, [Date.now()]);
};

module.exports = { createQuote, deleteQuoteById, updateQuoteById, getQuoteById, getAllQuotes };
