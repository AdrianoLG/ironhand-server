const mongoose = require('mongoose')

const cocktailSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	img: { type: String },
	ingredients: { type: Array },
	mixture: { type: Array }
})

module.exports = mongoose.model('Cocktail', cocktailSchema)
