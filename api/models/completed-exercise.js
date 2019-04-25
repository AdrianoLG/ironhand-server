const mongoose = require('mongoose')

const completedExerciseSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	exerciseId: { type: String, required: true },
	date: { type: String, required: true },
	repetitions: { type: Number },
	time: { type: Number },
	minHeart: { type: Number },
	maxHeart: { type: Number }
})

module.exports = mongoose.model('CompletedExercise', completedExerciseSchema)
