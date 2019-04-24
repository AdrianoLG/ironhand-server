const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	category: { type: String, required: true },
	todo: { type: Array, required: true },
	doing: { type: Array, required: true },
	done: { type: Array, required: true }
})

module.exports = mongoose.model('Project', projectSchema)
