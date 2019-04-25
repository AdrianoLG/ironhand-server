const mongoose = require('mongoose')

const rehearsalSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	instrument: { type: String, required: true },
	time: { type: Number, required: true },
	sheets: { type: Array }
})

module.exports = mongoose.model('Rehearsal', rehearsalSchema)
