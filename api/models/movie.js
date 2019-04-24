const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	title: { type: String, required: true },
	director: { type: String, required: true },
	year: { type: Number, required: true },
	cast: { type: Array },
	categories: { type: Array, required: true },
	duration: { type: Number },
	img: { type: String },
	seen: { type: Boolean },
	seenDate: { type: String },
	rating: { type: Number }
})

module.exports = mongoose.model('Movie', movieSchema)
