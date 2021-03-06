const fetch = require('node-fetch');
const conf = require('./config');
const Cache = require('./cache');

const cache = new Cache();

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getWeather () {
	const city = encodeURIComponent(conf.openweathermap.city);
	const key = encodeURIComponent(conf.openweathermap.api_key);

	const URL = BASE_URL + `/weather?q=${city}&appid=${key}&units=metric`;

	return cache.fetch(URL, () => {
		return fetch(URL).then(x => x.json()).then(x => {
			return {
				description: x.weather[0].description,
				icon: `http://openweathermap.org/img/wn/${x.weather[0].icon}.png`,
				temperature: x.main.temp,
			}
		});
	})
}

module.exports = {
	get: getWeather
}