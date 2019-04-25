const mongoose = require('mongoose')

const jgSeedSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	bank: { type: String, required: true },
	img: { type: String },
	genetic: { type: String },
	indicaSativa: { type: String, required: true },
	productivity: { type: String },
	flowering: { type: String },
	height: { type: Number },
	effect: { type: String },
	aroma: { type: String }
})

module.exports = mongoose.model('JGSeed', jgSeedSchema)
