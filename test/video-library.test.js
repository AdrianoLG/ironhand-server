const supertest = require('supertest')
const api = supertest('http://192.168.1.43:32776')
const chai = require('chai')
const assertArrays = require('chai-arrays')

const expect = chai.expect
chai.use(assertArrays)

let token = ''
let id = ''
let movieId = ''
let tvSeriesId = ''

describe('Video Library CRUD', function() {
	// Creates user and retrieves token before test
	before(function(done) {
		api
			.post('/user/signup')
			.set('Accept', 'application/json')
			.send({
				email: 'testuser@gmail.com',
				password: '123'
			})
			.expect(201)
			.end((err, res) => {
				expect(res.body.message).to.equal('User created')
				api
					.post('/user/login')
					.set('Accept', 'application/json')
					.send({
						email: 'testuser@gmail.com',
						password: '123'
					})
					.expect(200)
					.end((error, response) => {
						token = response.body.token
						expect(response.body.message).to.equal('Logged in')
						done()
					})
			})
	})

	it('should return an empty movie list', function(done) {
		api.get('/video-library/movies').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('movies')
			done()
		})
	})

	it('should return an empty tv series list', function(done) {
		api.get('/video-library/tv-series').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('tvSeries')
			done()
		})
	})

	it('should create a movie', function(done) {
		api
			.post('/video-library/movies')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Pulp Fiction',
				director: 'Quentin Tarantino',
				year: 1994,
				cast: [
					'John Travolta',
					'Uma Thurman',
					'Samuel L. Jackson',
					'Bruce Willis'
				],
				categories: [
					'Acción',
					'Culto'
				],
				duration: 215,
				img: 'http://dev.ironhand.com/uploads/video-library/movie/pulp-fiction.jpg',
				seen: true,
				seenDate: '2019-02-22T23:00:00',
				rating: 9
			})
			.expect(201)
			.end((err, res) => {
				movieId = res.body.createdMovie._id
				expect(res.body.message).to.equal('Movie created')
				expect(res.body.createdMovie.title).to.equal('Pulp Fiction')
				expect(res.body.createdMovie.director).to.equal('Quentin Tarantino')
				expect(res.body.createdMovie.year).to.equal(1994)
				expect(res.body.createdMovie.cast).to.be.array()
				expect(res.body.createdMovie.cast).to.be.ofSize(4)
				expect(res.body.createdMovie.categories).to.be.array()
				expect(res.body.createdMovie.categories).to.be.ofSize(2)
				expect(res.body.createdMovie.duration).to.equal(215)
				expect(res.body.createdMovie.img).to.equal(
					'http://dev.ironhand.com/uploads/video-library/movie/pulp-fiction.jpg'
				)
				expect(res.body.createdMovie.seen).to.equal(true)
				expect(res.body.createdMovie.seenDate).to.equal('2019-02-22T23:00:00')
				expect(res.body.createdMovie.rating).to.equal(9)
				done()
			})
	})

	it('should create a tv series', function(done) {
		api
			.post('/video-library/tv-series')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Weeds',
				director: 'Jenji Kohan',
				cast: [
					'Mary-Louise Parker',
					'Hunter Parrish',
					'Kevin Nealon',
					'Alexander Gould',
					'Justin Kirk'
				],
				tv: 'Showtime',
				country: 'EE.UU.',
				beginDate: '2005-08-07T00:00:00',
				lastSeen: '2x07',
				ended: true,
				endDate: '2012-09-16T00:00:00',
				categories: [
					'Humor negro',
					'Comedia dramática'
				]
			})
			.expect(201)
			.end((err, res) => {
				tvSeriesId = res.body.createdTvSeries._id
				expect(res.body.message).to.equal('Tv series created')
				expect(res.body.createdTvSeries.title).to.equal('Weeds')
				expect(res.body.createdTvSeries.director).to.equal('Jenji Kohan')
				expect(res.body.createdTvSeries.cast).to.be.array()
				expect(res.body.createdTvSeries.cast).to.be.ofSize(5)
				expect(res.body.createdTvSeries.tv).to.equal('Showtime')
				expect(res.body.createdTvSeries.country).to.equal('EE.UU.')
				expect(res.body.createdTvSeries.beginDate).to.equal('2005-08-07T00:00:00')
				expect(res.body.createdTvSeries.lastSeen).to.equal('2x07')
				expect(res.body.createdTvSeries.ended).to.equal(true)
				expect(res.body.createdTvSeries.endDate).to.equal('2012-09-16T00:00:00')
				expect(res.body.createdTvSeries.categories).to.be.array()
				expect(res.body.createdTvSeries.categories).to.be.ofSize(2)
				done()
			})
	})

	it('should update a movie', function(done) {
		api
			.patch(`/video-library/movies/${movieId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{
					propName: 'categories',
					value: [
						'Acción',
						'Culto',
						'Violencia'
					]
				}
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Movie updated')
				done()
			})
	})

	it('should update a tv series', function(done) {
		api
			.patch(`/video-library/tv-series/${tvSeriesId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{
					propName: 'categories',
					value: [
						'Humor negro',
						'Comedia'
					]
				}
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Tv series updated')
				done()
			})
	})

	it('should get updated movie', function(done) {
		api
			.get(`/video-library/movies/${movieId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.categories).to.be.ofSize(3)
				done()
			})
	})

	it('should get updated tv series', function(done) {
		api
			.get(`/video-library/tv-series/${tvSeriesId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.categories[1]).to.equal('Comedia')
				done()
			})
	})

	it('should fail to get movie with wrong ID', function(done) {
		api.get('/video-library/movies/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No movie with that ID')
			done()
		})
	})

	it('should fail to get tv series with wrong ID', function(done) {
		api.get('/video-library/tv-series/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No tv series with that ID')
			done()
		})
	})

	it('should fail to get movie if no user ID is present', function(done) {
		api.get(`/video-library/movies/${movieId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should fail to get tv series if no user ID is present', function(done) {
		api
			.get(`/video-library/tv-series/${tvSeriesId}`)
			.set('Authorization', 'Bearer ABC')
			.expect(401)
			.end((err, res) => {
				expect(res.body.message).to.equal('Auth failed')
				done()
			})
	})

	it('should delete movie', function(done) {
		api
			.delete(`/video-library/movies/${movieId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Movie deleted')
				done()
			})
	})

	it('should delete tv series', function(done) {
		api
			.delete(`/video-library/tv-series/${tvSeriesId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Tv series deleted')
				done()
			})
	})

	after(function(done) {
		// Destroys user after test
		api
			.post('/user/id')
			.send({
				token: token
			})
			.expect(200)
			.end((err, res) => {
				id = res.body.userId
				expect(res.body).to.have.property('userId')
				api.delete(`/user/${id}`).set('Authorization', `Bearer ${token}`).expect(200).end((error, response) => {
					expect(response.body.message).to.equal('User deleted')
					done()
				})
			})
	})
})
