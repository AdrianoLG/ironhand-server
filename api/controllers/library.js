const Book = require('../models/book')
const mongoose = require('mongoose')

exports.books_get_all = (req, res, next) => {
	Book.find({ userId: req.userData.userId })
		.select('_id title author category pages img read readDate rating comments')
		.sort({ title: 'desc', category: 'desc' })
		.exec()
		.then(books => {
			const response = {
				count: books.length,
				books: books
			}
			console.log(books)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.book_create = (req, res, next) => {
	const book = new Book({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		title: req.body.title,
		author: req.body.author,
		category: req.body.category,
		pages: req.body.pages,
		img: req.body.img,
		read: req.body.read,
		readDate: req.body.readDate,
		rating: req.body.rating,
		comments: req.body.comments
	})
	book
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Book created',
				createdBook: {
					_id: result._id,
					title: result.title,
					author: result.author,
					category: result.category,
					pages: result.pages,
					img: result.img,
					read: result.read,
					readDate: result.readDate,
					rating: result.rating,
					comments: result.comments
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

exports.book_get = (req, res, next) => {
	const id = req.params.bookId
	Book.findOne({ _id: id, userId: req.userData.userId })
		.select('_id title author category pages img read readDate rating comments')
		.exec()
		.then(book => {
			console.log(book)
			res.status(200).json(book)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId' || err.name == 'CastError') {
				return res.status(404).json({
					message: 'No book with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.book_update = (req, res, next) => {
	const id = req.params.bookId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Book.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Book updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.book_delete = (req, res, next) => {
	const id = req.params.bookId
	Book.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Book.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Book deleted'
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
