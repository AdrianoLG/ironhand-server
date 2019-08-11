const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	category: { type: String, required: true },
	priority: { type: Number, required: true },
	completed: { type: Boolean, default: false }
})

module.exports = mongoose.model('Todo', todoSchema)
