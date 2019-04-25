const mongoose = require('mongoose')

const recipeeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	img: { type: String },
	ingredients: { type: Array },
	instructions: { type: Array }
})

module.exports = mongoose.model('Recipee', recipeeSchema)
