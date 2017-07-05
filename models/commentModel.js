const db = require('../models/setup');
const moment = require('moment')

const Comment = {};

function createComment(body) {
    const utc = moment(new Date()).unix();
    const utcTimestamp = moment.unix(utc).format('YYYY-MM-DD HH:mm:ss');
    return db.oneOrNone(`
    INSERT INTO comments
    (pun, quote_id, user_id, created_date, last_modified_date)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *`, [body.punText, body.quoteId, body.userId, utcTimestamp, utcTimestamp]);
    // console.log('creating comment');
};

function deleteCommentById(body) {
    return db.oneOrNone(`
    DELETE FROM comments
    WHERE id = $1`, [body.commentId]);
};

function updateCommentById(body) {
    const utc = moment(new Date()).unix();
    const utcTimestamp = moment.unix(utc).format('YYYY-MM-DD HH:mm:ss');
    return db.one(`
      UPDATE comments SET
      pun = $1,
      last_modified_date = $2,
      WHERE id = $3
      returning *;`, [body.pun,
        utcTimestamp,
        body.commentId
    ]);
};

function getCommentById(body) {
    return db.oneOrNone(`
    SELECT * 
    From comments
    WHERE id = $1;`, [body.commentId]);
};

function getCommentsByQuote(body) {
    return db.any(`
    SELECT * 
    From comments
    WHERE quote_id = $1;`, [body.quoteId]);
};

module.exports = { createComment, getCommentById, getCommentsByQuote, deleteCommentById, updateCommentById };
