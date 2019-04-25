const mongoose = require('mongoose')

const wateringSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	container: { type: String, required: true },
	date: { type: String },
	fertilizer: { type: Array }
})

module.exports = mongoose.model('Watering', wateringSchema)
