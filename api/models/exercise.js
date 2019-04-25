const mongoose = require('mongoose')

const exerciseSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	category: { type: String, required: true },
	bodyParts: { type: Array, required: true }
})

module.exports = mongoose.model('Exercise', exerciseSchema)
