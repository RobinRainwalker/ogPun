const db = require('../models/setup');

const Giggle = {};

function createGiggle(body) {
    console.log('hello from createGiggle: ', body);
    return db.oneOrNone(`
    INSERT INTO giggles
    (comment_id, user_id)
    VALUES
    ($1, $2)
    RETURNING *`, [body.commentId, body.userId]);
};

function deleteGiggleById(body) {
    return db.oneOrNone(`
    DELETE FROM giggles
    WHERE id = $1`, [body.giggleId]);
    // console.log('result: ', result);
};

function getGigglesByCommentId(body) {
    console.log('getting giggles by comment id: ', body);
    return db.any(`
    SELECT * 
    FROM giggles
    WHERE comment_id = $1`, [body.commentId]);
    // console.log('result: ', result);
};

function getGigglesByCommentIds(comments) {

    if (comments.length < 1) return [];

    let params = [];
    let commentIds = [];

    for (let i = 0; i < comments.length; i++) {
        commentIds.push(comments[i].id);
        params.push('$' + (i+1));
    }

    const mergeList = params.join(',');

    return db.any(`
    SELECT * 
    FROM giggles
    WHERE comment_id IN (${mergeList});`, commentIds);
    // console.log('result: ', result);
};

module.exports = {
    createGiggle,
    deleteGiggleById,
    getGigglesByCommentId,
    getGigglesByCommentIds
};
