const weather = require('../models/weather');

/**
 * Controller for notes
 * @param {express.Router} app 
 */
module.exports = function (app) {
	app.get('/weather/get', async (req, res, next) => {
		try {
			const w = await weather.get();

			res.json({
				success: true,
				...w,
			});
		}
		catch (err) {
			next(err);
		}
	})
}
