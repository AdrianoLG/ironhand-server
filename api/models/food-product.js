const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	name: { type: String, required: true },
	brand: String,
	category: { type: String, required: true },
	img: String,
	qty: { type: Number, required: true, min: 0 },
	unit: { type: String, required: true },
	productQty: { type: Number, min: 0 },
	expiry: Date,
	tags: String
})

module.exports = mongoose.model('Product', productSchema)
