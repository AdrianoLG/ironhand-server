const mongoose = require('mongoose')

const plantSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	scientific: { type: String },
	container: { type: String, required: true },
	zone: { type: String },
	gallery: { type: Array },
	sun: { type: String, required: true },
	watering: { type: Array },
	wateringFrequency: { type: String, required: true },
	frost: { type: Boolean },
	soil: { type: String },
	flowering: { type: String },
	perishable: { type: Boolean },
	pests: { type: Array },
	img: { type: String },
	origin: { type: Array },
	transplant: { type: Array },
	death: { type: String },
	deathCause: { type: String }
})

module.exports = mongoose.model('Plant', plantSchema)
