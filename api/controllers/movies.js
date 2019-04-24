const Movie = require('../models/movie')
const mongoose = require('mongoose')

exports.movies_get_all = (req, res, next) => {
	Movie.find({ userId: req.userData.userId })
		.select('_id title director year cast categories duration img seen seenDate rating')
		.exec()
		.then(movies => {
			const response = {
				count: movies.length,
				movies: movies
			}
			console.log(movies)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.movie_create = (req, res, next) => {
	const movie = new Movie({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		title: req.body.title,
		director: req.body.director,
		year: req.body.year,
		cast: req.body.cast,
		categories: req.body.categories,
		duration: req.body.duration,
		img: req.body.img,
		seen: req.body.seen,
		seenDate: req.body.seenDate,
		rating: req.body.rating
	})
	movie
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Movie created',
				createdMovie: {
					_id: result._id,
					title: result.title,
					director: result.director,
					year: result.year,
					cast: result.cast,
					categories: result.categories,
					duration: result.duration,
					img: result.img,
					seen: result.seen,
					seenDate: result.seenDate,
					rating: result.rating
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

exports.movie_get = (req, res, next) => {
	const id = req.params.movieId
	Movie.findOne({ _id: id, userId: req.userData.userId })
		.select('_id title director year cast categories duration img seen seenDate rating')
		.exec()
		.then(movie => {
			console.log(movie)
			res.status(200).json(movie)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No movie with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.movie_update = (req, res, next) => {
	const id = req.params.movieId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Movie.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Movie updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.movie_delete = (req, res, next) => {
	const id = req.params.movieId
	Movie.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Movie.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Movie deleted'
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
