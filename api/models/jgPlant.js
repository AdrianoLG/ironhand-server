const mongoose = require('mongoose')

const jgPlantSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	seedId: { type: String, required: true },
	name: { type: String, required: true },
	container: { type: String, required: true },
	coords: { type: String },
	gallery: { type: Array }
})

module.exports = mongoose.model('JGPlant', jgPlantSchema)
