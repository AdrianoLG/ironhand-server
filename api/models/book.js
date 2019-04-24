const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	title: { type: String, required: true },
	author: { type: String, required: true },
	category: { type: String, required: true },
	pages: { type: Number },
	img: { type: String },
	read: { type: Boolean },
	readDate: { type: String },
	rating: { type: Number },
	comments: { type: String }
})

module.exports = mongoose.model('Book', bookSchema)
