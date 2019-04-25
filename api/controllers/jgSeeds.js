const JGSeed = require('../models/jgSeed')
const mongoose = require('mongoose')

exports.jgSeeds_get_all = (req, res, next) => {
	JGSeed.find({ userId: req.userData.userId })
		.select('_id name bank img genetic indicaSativa productivity flowering height effect aroma')
		.exec()
		.then(jgSeeds => {
			const response = {
				count: jgSeeds.length,
				jgSeeds: jgSeeds
			}
			console.log(jgSeeds)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.jgSeed_create = (req, res, next) => {
	const jgSeed = new JGSeed({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		bank: req.body.bank,
		img: req.body.img,
		genetic: req.body.genetic,
		indicaSativa: req.body.indicaSativa,
		productivity: req.body.productivity,
		flowering: req.body.flowering,
		height: req.body.height,
		effect: req.body.effect,
		aroma: req.body.aroma
	})
	jgSeed
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'JG seed created',
				createdJGSeed: {
					_id: result._id,
					name: result.name,
					bank: result.bank,
					img: result.img,
					genetic: result.genetic,
					indicaSativa: result.indicaSativa,
					productivity: result.productivity,
					flowering: result.flowering,
					height: result.height,
					effect: result.effect,
					aroma: result.aroma
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

exports.jgSeed_get = (req, res, next) => {
	const id = req.params.jgSeedId
	JGSeed.findOne({ _id: id, userId: req.userData.userId })
		.select('_id name bank img genetic indicaSativa productivity flowering height effect aroma')
		.exec()
		.then(jgSeed => {
			console.log(jgSeed)
			res.status(200).json(jgSeed)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No JG seed with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.jgSeed_update = (req, res, next) => {
	const id = req.params.jgSeedId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	JGSeed.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'JG seed updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.jgSeed_delete = (req, res, next) => {
	const id = req.params.jgSeedId
	JGSeed.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			JGSeed.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'JG seed deleted'
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
