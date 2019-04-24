const mongoose = require('mongoose')

const drinkSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	brand: { type: String, required: true },
	category: { type: String, required: true },
	alcohol: { type: Boolean, required: true },
	graduation: { type: Number },
	img: { type: String },
	qty: { type: Number, required: true },
	unit: { type: String, required: true },
	productQty: { type: Number }
})

module.exports = mongoose.model('Drink', drinkSchema)
