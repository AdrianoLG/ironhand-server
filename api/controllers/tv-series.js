const TvSeries = require('../models/tv-series')
const mongoose = require('mongoose')

exports.tvSeries_get_all = (req, res, next) => {
	TvSeries.find({ userId: req.userData.userId })
		.select('_id title director cast tv country beginDate lastSeen ended endDate categories episodeDuration img')
		.sort({ _id: 'desc' })
		.exec()
		.then(tvSeries => {
			const response = {
				count: tvSeries.length,
				tvSeries: tvSeries
			}
			console.log(tvSeries)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.tvSeries_create = (req, res, next) => {
	const tvSeries = new TvSeries({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		title: req.body.title,
		director: req.body.director,
		cast: req.body.cast,
		tv: req.body.tv,
		country: req.body.country,
		beginDate: req.body.beginDate,
		lastSeen: req.body.lastSeen,
		ended: req.body.ended,
		endDate: req.body.endDate,
		categories: req.body.categories,
		episodeDuration: req.body.episodeDuration,
		img: req.body.img
	})
	tvSeries
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Tv series created',
				createdTvSeries: {
					_id: result._id,
					title: result.title,
					director: result.director,
					cast: result.cast,
					tv: result.tv,
					country: result.country,
					beginDate: result.beginDate,
					lastSeen: result.lastSeen,
					ended: result.ended,
					endDate: result.endDate,
					categories: result.categories,
					episodeDuration: result.episodeDuration,
					img: result.img
				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.tvSeries_get = (req, res, next) => {
	const id = req.params.tvSeriesId
	TvSeries.findOne({ _id: id, userId: req.userData.userId })
		.select('_id title director cast tv country beginDate lastSeen ended endDate categories episodeDuration img')
		.exec()
		.then(tvSeries => {
			console.log(tvSeries)
			res.status(200).json(tvSeries)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No tv series with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.tvSeries_update = (req, res, next) => {
	const id = req.params.tvSeriesId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	TvSeries.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Tv series updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.tvSeries_delete = (req, res, next) => {
	const id = req.params.tvSeriesId
	TvSeries.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			TvSeries.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Tv series deleted'
					})
				})
				.catch(err => {
					console.log(err)
					res.status(500).json({
						error: err
					})
				})
		})
		.catch()
}
