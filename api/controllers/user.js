const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.user_signup = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then(user => {
			if (user.length > 0) {
				return res.status(409).json({
					message: 'User already exists'
				})
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							error: err
						})
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash
						})
						user
							.save()
							.then(result => {
								res.status(201).json({
									message: 'User created'
								})
							})
							.catch(err => {
								console.log(err)
								res.status(500).json({
									error: err
								})
							})
					}
				})
			}
		})
		.catch()
}

exports.user_login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.exec()
		.then(user => {
			if (!user) {
				return res.status(401).json({
					message: 'Auth failed'
				})
			}
			bcrypt.compare(req.body.password, user.password, (err, success) => {
				if (err) {
					return res.status(401).json({
						message: 'Auth failed'
					})
				}
				if (success) {
					const token = jwt.sign(
						{
							email: user.email,
							userId: user._id
						},
						process.env.JWT_KEY,
						{
							expiresIn: '1h'
						}
					)
					return res.status(200).json({
						message: 'Logged in',
						token: token
					})
				}
				res.status(401).json({
					message: 'Auth failed'
				})
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.user_delete = (req, res, next) => {
	User.deleteOne({ _id: req.params.userId })
		.exec()
		.then(response => {
			res.status(200).json({
				message: 'User deleted'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.user_id = (req, res, next) => {
	const token = req.body.token
	try {
		const userId = jwt.decode(token).userId
		console.log(userId)
		res.status(200).json({
			userId: userId
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			error: err
		})
	}
}
