const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')

router.post('/signup', userController.user_signup)
router.post('/login', userController.user_login)
router.delete('/:userId', userController.user_delete)
router.post('/id', userController.user_id)

// ! List of users, just for development purposes
// const User = require('../models/user')
// router.get('/', (req, res, next) => {
// 	User.find()
// 		.exec()
// 		.then(users => {
// 			return res.status(200).json({
// 				users: users
// 			})
// 		})
// 		.catch(err => {
// 			return res.status(500).json({
// 				error: err
// 			})
// 		})
// })

module.exports = router
