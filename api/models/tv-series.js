const mongoose = require('mongoose')

const tvSeriesSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	userId: { type: String, required: true },
	title: { type: String, required: true },
	director: { type: String },
	cast: { type: Array },
	tv: { type: String },
	country: { type: String, required: true },
	beginDate: { type: String, required: true },
	lastSeen: { type: String },
	ended: { type: Boolean, required: true },
	endDate: { type: String },
	categories: { type: Array, required: true },
	episodeDuration: { type: Number },
	img: { type: String }
})

module.exports = mongoose.model('TvSeries', tvSeriesSchema)
