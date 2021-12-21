const conf = require('./config');
const fetch = require('node-fetch');

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getWeather () {
	const city = encodeURIComponent(conf.openweathermap.city);
	const key = encodeURIComponent(conf.openweathermap.api_key);

	const URL = BASE_URL + `/weather?q=${city}&appid=${key}`;

	return fetch(URL).then(x => x.json()).then(x => {
		return {
			weather: {
				description: x.weather[0].description,
				icon: `http://openweathermap.org/img/wn/${x.weather[0].icon}.png`
			},
			temperature: x.main.temp,
		}
	});
}

module.exports = {
	get: getWeather
}