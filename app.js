const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// Routes path
const userRoutes = require('./api/routes/user')
const todoRoutes = require('./api/routes/todos')
const projectRoutes = require('./api/routes/projects')
const foodRoutes = require('./api/routes/food')
const drinkRoutes = require('./api/routes/drinks')
const libraryRoutes = require('./api/routes/library')
const videoLibraryRoutes = require('./api/routes/video-library')
const plantsRoutes = require('./api/routes/plants')
const joyGardenRoutes = require('./api/routes/joy-garden')

// DB connection
mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
	useNewUrlParser: true,
	useCreateIndex: true
})

// Use logging and prettify JSON
app.use(morgan('dev'))

// Folder to save images
app.use('/uploads', express.static('uploads'))

// req.body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Headers
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
app.use('/user', userRoutes)
app.use('/todos', todoRoutes)
app.use('/projects', projectRoutes)
app.use('/food', foodRoutes)
app.use('/drinks', drinkRoutes)
app.use('/library', libraryRoutes)
app.use('/video-library', videoLibraryRoutes)
app.use('/plants', plantsRoutes)
app.use('/joy-garden', joyGardenRoutes)

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
