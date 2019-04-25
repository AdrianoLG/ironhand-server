const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const ExercisesController = require('../controllers/exercises')
const CompletedExercisesController = require('../controllers/completed-exercises')

router.get('/exercises/', checkAuth, ExercisesController.exercises_get_all)
router.post('/exercises/', checkAuth, ExercisesController.exercise_create)
router.get('/exercises/:exerciseId', checkAuth, ExercisesController.exercise_get)
router.patch('/exercises/:exerciseId', checkAuth, ExercisesController.exercise_update)
router.delete('/exercises/:exerciseId', checkAuth, ExercisesController.exercise_delete)
router.get('/completed-exercises/', checkAuth, CompletedExercisesController.completedExercises_get_all)
router.post('/completed-exercises/', checkAuth, CompletedExercisesController.completedExercise_create)
router.get('/completed-exercises/:completedExerciseId', checkAuth, CompletedExercisesController.completedExercise_get)
router.patch(
	'/completed-exercises/:completedExerciseId',
	checkAuth,
	CompletedExercisesController.completedExercise_update
)
router.delete(
	'/completed-exercises/:completedExerciseId',
	checkAuth,
	CompletedExercisesController.completedExercise_delete
)

module.exports = router
