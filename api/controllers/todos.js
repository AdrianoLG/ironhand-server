const Todo = require('../models/todo')
const mongoose = require('mongoose')

exports.todos_get_all = (req, res, next) => {
	Todo.find({ userId: req.userData.userId })
		.select('_id name category priority')
		.exec()
		.then(todos => {
			const response = {
				count: todos.length,
				todos: todos
			}
			console.log(todos)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.todo_create = (req, res, next) => {
	const todo = new Todo({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		category: req.body.category,
		priority: req.body.priority
	})
	todo
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Todo created',
				createdTodo: {
					_id: result._id,
					name: result.name,
					category: result.category,
					priority: result.priority
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

exports.todo_get = (req, res, next) => {
	const id = req.params.todoId
	Todo.findOne({ _id: id, userId: req.userData.userId })
		.select('_id name category priority')
		.exec()
		.then(todo => {
			console.log(todo)
			res.status(200).json(todo)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No todo with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.todo_update = (req, res, next) => {
	const id = req.params.todoId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Todo.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Todo updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.todo_delete = (req, res, next) => {
	const id = req.params.todoId
	Todo.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Todo.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Todo deleted'
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
