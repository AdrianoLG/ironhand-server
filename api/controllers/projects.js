const Project = require('../models/project')
const mongoose = require('mongoose')

exports.projects_get_all = (req, res, next) => {
	Project.find({ userId: req.userData.userId })
		.select('_id name category todo doing done')
		.exec()
		.then(projects => {
			const response = {
				count: projects.length,
				projects: projects
			}
			console.log(projects)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.project_create = (req, res, next) => {
	const project = new Project({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		category: req.body.category,
		todo: req.body.todo,
		doing: req.body.doing,
		done: req.body.done
	})
	project
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Project created',
				createdProject: {
					_id: result._id,
					name: result.name,
					category: result.category,
					todo: result.todo,
					doing: result.doing,
					done: result.done
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

exports.project_get = (req, res, next) => {
	const id = req.params.projectId
	Project.findOne({ _id: id, userId: req.userData.userId })
		.select('_id name category todo doing done')
		.exec()
		.then(project => {
			console.log(project)
			res.status(200).json(project)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No project with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.project_update = (req, res, next) => {
	const id = req.params.projectId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Project.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Project updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.project_delete = (req, res, next) => {
	const id = req.params.projectId
	Project.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Project.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Project deleted'
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
