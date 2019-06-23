const mongoose = require('mongoose')

const mealSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	breakfast: Array,
	lunch: Array,
	dinner: Array,
	date: Date
})

module.exports = mongoose.model('Meal', mealSchema)
