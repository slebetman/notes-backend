const db = require('../db');

function getNotes () {
	return db('notes');
}

function getNoteById (id) {
	return db('notes').where({ id }).first();
}

function createNote (title, content, color) {
	return db('notes').insert({
		title,
		content,
		color: color || null,
	});
}

function updateNote (id, title, content, color) {
	return db('notes').where({ id }).update({
		title,
		content,
		color,
	});
}

function deleteNote (id) {
	return db('notes').where({ id }).delete();
}

module.exports = {
	getNotes,
	getNoteById,
	createNote,
	updateNote,
	deleteNote,
}