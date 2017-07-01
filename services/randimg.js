const axios = require('axios');

const makeBackground = () => {
	return axios.get(`https://api.unsplash.com/photos/random/?client_id=${process.env.img_api_key}`)
	.then((response) => {
		console.log(response);
		console.log('hello from the background service <3')
		return response
	})
	.catch((error) => {
		console.log(error)
	});
};

module.exports = { makeBackground }