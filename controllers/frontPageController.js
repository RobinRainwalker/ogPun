const router = require('express').Router();
const passport = require('passport');
const auth = require('../services/auth');
const background = require('../services/randimg.js');
const Models = require('../models/models.js');
const Quote = Models.Quote;
const Comment = Models.Comment;
const Giggle = Models.Giggle;
const Groan = Models.Groan;
const axios = require('axios');
const moment = require('moment');
const suncalc = require('suncalc');


const getFrontPage = (req, res) => {
    let quoteData = {};
    // get the quote of the day
    Quote
        .getAllQuotes()
        .then((quotes) => {
            // console.log('getQuoteOfTheDay ', quotes);
            quotesToday = quotes.reduce((sum, value) => {
                if (moment(value.created_date).isSame(Date.now(), 'day')) {
                    // console.log('returning ' + quotes.length + ' quotes', quotes);
                    sum.push(value);
                }
                return sum;
            }, []);
            if (quotesToday.length > 0) {
                return quotes[0];
            } else {
                // return suncalc.getTimes(new Date(), 43.35, 73.67);
                return axios.get(`http://quotes.rest/qod.json?category=art`);
            }
        })
        .then((response) => {
            if (!response.id) {
                // console.log('getQuoteOfTheDay afterfirst .then', response);

                // return Quote.createQuote({ bgImgSrc: " ", quoteText: response.solarNoon, author: response.nadir })
                console.log(response.data);
                console.log(response.data.contents);
                const quote = response.data.contents.quotes[0].quote;
                const author = response.data.contents.quotes[0].author;
                return Quote.createQuote({ bgImgSrc: " ", quoteText: quote, author: author });
            } else {
                return response;
            }
        })
        .then((response) => {
            quoteData.quote = {};
            quoteData.quote.id = response.id;
            quoteData.quote.quote = response.quote;
            quoteData.quote.author = response.author;
            quoteData.quote.created_date = response.created_date;
            // console.log('quoteData assign to: ', quoteData);
            // console.log('got quote data');
            return Comment.getCommentsByQuote({ quoteId: response.id });
        })
        .then((response) => {
            // console.log('got comment data', response);
            quoteData.comments = response;
            return Groan.getGroansByCommentIds(quoteData.comments);
        })
        .then((response) => {
            // console.log('got got groan data', response);
            quoteData.groans = response;
            return Giggle.getGigglesByCommentIds(quoteData.comments)
        })
        .then((response) => {
            // console.log('got got giggle data', response);
            quoteData.giggles = response;
            quoteData = getGroanCount(quoteData);
            quoteData = getGiggleCount(quoteData);
            quoteData = getHumanFriendlyTimestamps(quoteData);
            // console.log('quoteData', quoteData);
            quoteData.user = {id: req.body.id, username: req.user.username};
            res.render('front', {
                user: quoteData.user,
                quote: quoteData.quote,
                comments: quoteData.comments,
                groans: quoteData.groans,
                giggles: quoteData.giggles
            });
        })
        .catch(err => console.log('error: ', err));
}

const postComment = (req, res) => {
    Comment
        .createComment({
            punText: req.body.punText,
            quoteId: req.body.quoteId,
            userId: req.user.id
        })
        .then((response) => {
            res.json(response);
        })
        .catch(err => console.log('error: ', err));
}

const addGiggle = (req, res) => {
    Giggle
        .getGigglesByCommentId({ commentId: req.body.commentId })
        .then((response) => {
            if (response.length > 0) {
                let userIds = response.reduce((sum, value) => {
                    sum.push(value.user_id);
                    return sum;
                }, []);
                const includes = userIds.some((value, index) => {
                    return value == req.user.id;
                });
                if (includes) {
                    return { text: 'erRor' };
                } else {
                    return Giggle.createGiggle({
                        commentId: req.body.commentId,
                        userId: req.user.id
                    });
                }
            } else {
                return Giggle.createGiggle({
                    commentId: req.body.commentId,
                    userId: req.user.id
                });
            }
        })
        .then((response) => {
            res.json(response);
        });
};

const addGroan = (req, res) => {
    Groan
        .getGroansByCommentId({ commentId: req.body.commentId })
        .then((response) => {
            if (response.length > 0) {
                let userIds = response.reduce((sum, value) => {
                    sum.push(value.user_id);
                    return sum;
                }, []);
                const includes = userIds.some((value, index) => {
                    return value == req.user.id;
                });
                if (includes) {
                    return { text: 'erRor' };
                } else {
                    return Groan.createGroan({
                        commentId: req.body.commentId,
                        userId: req.user.id
                    });
                }
            } else {
                return Groan.createGroan({
                    commentId: req.body.commentId,
                    userId: req.user.id
                });
            }
        })
        .then((response) => {
            res.json(response);
        });
};

const getGiggleCount = (data) => {

    let giggleCommentIds = data.giggles.map((giggle) => {
        return giggle.comment_id
    });

    let comments = data.comments;
    let commentsWithGiggles = [];

    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];

        comment.giggles = [];

        let matchingGiggles = data.giggles.reduce((matched, giggle, index) => {
            if (giggle.comment_id == comment.id) matched.push(giggle);
            return matched;
        }, []);

        if (matchingGiggles.length > 0) {
            comment.giggles = matchingGiggles;
        }

        comment.giggleCount = matchingGiggles.length
        commentsWithGiggles.push(comment);
    }

    data.comments = commentsWithGiggles;
    return data;

}

const getGroanCount = (data) => {

    let groanCommentIds = data.groans.map((groan) => {
        return groan.comment_id
    });

    let comments = data.comments;
    let commentsWithGroans = [];

    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i];

        comment.groans = [];

        let matchingGroans = data.groans.reduce((matched, groan, index) => {
            if (groan.comment_id == comment.id) matched.push(groan);
            return matched;
        }, []);

        if (matchingGroans.length > 0) {
            comment.groans = matchingGroans;
        }

        comment.groanCount = matchingGroans.length
        commentsWithGroans.push(comment);
    }

    data.comments = commentsWithGroans;
    return data;

}

const getHumanFriendlyTimestamps = (data) => {

    let humanFriendlyTimestamps = data.comments.map((comment) => {
        return moment(comment.created_date).add(4, 'hours').fromNow();
    });

    for (var i = 0; i < data.comments.length; i++) {
        data.comments[i].humanFriendlyTimestamp = humanFriendlyTimestamps[i];
    }

    return data;
}



// axios.get('http://quotes.rest/qod.json?category=art')

module.exports = {
    getFrontPage,
    postComment,
    addGiggle,
    addGroan,
    getGiggleCount,
    getGroanCount
};
