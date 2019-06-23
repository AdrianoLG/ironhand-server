const mongoose = require('mongoose')

const suggestionSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	season: Array,
	ingredients: Array
})

module.exports = mongoose.model('Suggestion', suggestionSchema)
