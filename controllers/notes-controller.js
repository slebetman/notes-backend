const notes = require('../models/db/notes');
const bodyparser = require('body-parser');

/**
 * Controller for notes
 * @param {express.Router} app 
 */
module.exports = function (app) {
	app.get('/notes/list', async (req, res, next) => {
		try {
			const list = await notes.getNotes();

			res.json({
				success: true,
				notes: list,
			})
		}
		catch (err) {
			next(err);
		}
	});

	app.get('/notes/get/:id',async (req, res, next) => {
		const note_id = req.params.id;

		try {
			const note = await notes.getNoteById(note_id);

			res.json({
				success: true,
				note: note,
			})
		}
		catch (err) {
			next(err);
		}
	});

	app.post('/notes/new', bodyparser.json(), async (req, res, next) => {
		const title   = req.body.title;
		const content = req.body.content;
		const color   = req.body.color;

		try {
			await notes.createNote(title, content, color);

			res.json({
				success: true,
			})
		}
		catch (err) {
			next(err);
		}
	});

	app.post('/notes/edit/:id', bodyparser.json(), async (req, res, next) => {
		const note_id = req.params.id;
		const title   = req.body.title;
		const content = req.body.content;
		const color   = req.body.color;

		try {
			await notes.updateNote(note_id, title, content, color);

			res.json({
				success: true,
			})
		}
		catch (err) {
			next(err);
		}
	});

	app.post('/notes/delete/:id', async (req, res, next) => {
		const note_id = req.params.id;

		try {
			await notes.deleteNote(note_id);

			res.json({
				success: true,
			})
		}
		catch (err) {
			next(err);
		}
	});
}
