const db = require('../models/setup');

const Groan = {};

function createGroan(body) {
    console.log('hello from createGroan: ', body);
    return db.oneOrNone(`
    INSERT INTO groans
    (comment_id, user_id)
    VALUES
    ($1, $2)
    RETURNING *`, [body.commentId, body.userId]);
};

function deleteGroanById(body) {
    return db.oneOrNone(`
    DELETE FROM groans
    WHERE id = $1`, [body.groanId]);
};

function getGroansByCommentId(body) {
    return db.any(`
    SELECT * 
    FROM groans
    WHERE comment_id = $1;`, [body.commentId]);
};

function getGroansByCommentIds(comments) {
    console.log(comments.length);
    if (comments.length < 1) return [];

    let params = [];
    let commentIds = [];

    for (let i = 0; i < comments.length; i++) {
        commentIds.push(comments[i].id);
        params.push('$' + (i+1));
    }

    const mergeList = params.join(',');
    console.log('getting groans by comment ids: ', mergeList, commentIds);
    return db.any(`
    SELECT * 
    FROM groans
    WHERE comment_id IN (${mergeList});`, commentIds);
};

module.exports = {
    createGroan,
    deleteGroanById,
    getGroansByCommentId,
    getGroansByCommentIds
};
