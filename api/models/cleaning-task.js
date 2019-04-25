const mongoose = require('mongoose')

const cleaningTaskSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	place: { type: String, required: true },
	date: { type: String, required: true },
	tasks: { type: Array }
})

module.exports = mongoose.model('CleaningTask', cleaningTaskSchema)
