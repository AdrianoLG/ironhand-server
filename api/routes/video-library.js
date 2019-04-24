const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const MoviesController = require('../controllers/movies')
const TvSeriesController = require('../controllers/tv-series')

router.get('/movies', checkAuth, MoviesController.movies_get_all)
router.post('/movies', checkAuth, MoviesController.movie_create)
router.get('/movies/:movieId', checkAuth, MoviesController.movie_get)
router.patch('/movies/:movieId', checkAuth, MoviesController.movie_update)
router.delete('/movies/:movieId', checkAuth, MoviesController.movie_delete)
router.get('/tv-series', checkAuth, TvSeriesController.tvSeries_get_all)
router.post('/tv-series', checkAuth, TvSeriesController.tvSeries_create)
router.get('/tv-series/:tvSeriesId', checkAuth, TvSeriesController.tvSeries_get)
router.patch('/tv-series/:tvSeriesId', checkAuth, TvSeriesController.tvSeries_update)
router.delete('/tv-series/:tvSeriesId', checkAuth, TvSeriesController.tvSeries_delete)

module.exports = router
