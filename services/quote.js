const axios = require('axios');

const getQuote = () => {
	return axios.get(`http://quotes.rest/qod.json?category=art`)
	.then((response) => {
		console.log(response);
		return response
	})
	.catch((error) => {
		console.log(error)
	});
};

module.exports = { getQuote }