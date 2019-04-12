const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Routes path
const foodProductRoutes = require('./api/routes/food-product')
const userRoutes = require('./api/routes/user')

mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
	useNewUrlParser: true
})

// Use logging and prettify JSON
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
		return res.status(200).json({})
	}
	next()
})

// Routes usage
app.use('/food', foodProductRoutes)
app.use('/user', userRoutes)

// Handling errors
app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	res.json({
		error: {
			message: error.message
		}
	})
})

module.exports = app
