
//--- Import dependencies.
const map = require('lodash/map')
const pick = require('lodash/pick')
const axios = require('axios')

//--- Create an axios instance to query to.
const openai = axios.create({
	baseURL: 'https://api.openai.com/v1',
	headers: {'Content-Type': 'application/json'}
})

module.exports = async (prompt, config = {}) => {

	//--- Parse options.
	const secret = config.secret
	const options = pick(config, [
		'model',
		'max_tokens', 'temperature', 'top_p',
		'n', 'stream', 'logprobs', 'echo',
		'stop', 'presence_penalty', 'frequency_penalty',
		'best_of', 'logit_bias'
	])

	//--- Set OpenAI Secret API Key.
	openai.defaults.headers.common['Authorization'] = `Bearer ${secret}`

	let body = {prompt, ...options};
	//--- Query the GPT-3 API.
	return await openai.post(`/completions`, body)
		.then(res => map(res.data.choices, 'text'))
		.catch(err => console.error(err.response.data.error.message || err.message))
}