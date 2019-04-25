const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let exerciseId = ''
let completedExerciseId = ''

describe('Exercise CRUD', function() {
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

	it('should return an empty exercises list', function(done) {
		api.get('/exercise/exercises').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('exercises')
			done()
		})
	})

	it('should return an empty completed exercises list', function(done) {
		api.get('/exercise/completed-exercises').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('completedExercises')
			done()
		})
	})

	it('should create an exercise', function(done) {
		api
			.post('/exercise/exercises')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Cuerda',
				category: 'Cardio',
				bodyParts: [
					'Piernas',
					'Brazos'
				]
			})
			.expect(201)
			.end((err, res) => {
				exerciseId = res.body.createdExercise._id
				expect(res.body.message).to.equal('Exercise created')
				expect(res.body.createdExercise.name).to.equal('Cuerda')
				expect(res.body.createdExercise.category).to.equal('Cardio')
				expect(res.body.createdExercise.bodyParts).to.be.array()
				expect(res.body.createdExercise.bodyParts).to.be.ofSize(2)
				done()
			})
	})

	it('should create a completed exercise', function(done) {
		api
			.post('/exercise/completed-exercises')
			.set('Authorization', `Bearer ${token}`)
			.send({
				exerciseId: exerciseId,
				date: '2019-04-04T21:20:00',
				repetitions: null,
				time: 600,
				minHeart: 70,
				maxHeart: 120
			})
			.expect(201)
			.end((err, res) => {
				completedExerciseId = res.body.createdCompletedExercise._id
				expect(res.body.message).to.equal('Completed exercise created')
				expect(res.body.createdCompletedExercise.exerciseId).to.equal(exerciseId)
				expect(res.body.createdCompletedExercise.date).to.equal('2019-04-04T21:20:00')
				expect(res.body.createdCompletedExercise.repetitions).to.be.null
				expect(res.body.createdCompletedExercise.time).to.equal(600)
				expect(res.body.createdCompletedExercise.minHeart).to.equal(70)
				expect(res.body.createdCompletedExercise.maxHeart).to.equal(120)
				done()
			})
	})

	it('should update an exercise', function(done) {
		api
			.patch(`/exercise/exercises/${exerciseId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{
					propName: 'bodyParts',
					value: [
						'Piernas',
						'Brazos',
						'Espalda'
					]
				}
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Exercise updated')
				done()
			})
	})

	it('should update a completed exercise', function(done) {
		api
			.patch(`/exercise/completed-exercises/${completedExerciseId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'maxHeart', value: 110 }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Completed exercise updated')
				done()
			})
	})

	it('should get updated exercise', function(done) {
		api
			.get(`/exercise/exercises/${exerciseId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.name).to.equal('Cuerda')
				expect(res.body.bodyParts).to.be.array()
				expect(res.body.bodyParts).to.be.ofSize(3)
				done()
			})
	})

	it('should get updated completed exercise', function(done) {
		api
			.get(`/exercise/completed-exercises/${completedExerciseId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.minHeart).to.equal(70)
				expect(res.body.maxHeart).to.equal(110)
				done()
			})
	})

	it('should fail to get exercise with wrong ID', function(done) {
		api.get('/exercise/exercises/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No exercise with that ID')
			done()
		})
	})

	it('should fail to get completed exercise with wrong ID', function(done) {
		api
			.get('/exercise/completed-exercises/abc')
			.set('Authorization', `Bearer ${token}`)
			.expect(400)
			.end((err, res) => {
				expect(res.body.message).to.equal('No completed exercise with that ID')
				done()
			})
	})

	it('should fail to get exercise if no user ID is present', function(done) {
		api.get(`/exercise/exercises/${exerciseId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should fail to get exercise if no user ID is present', function(done) {
		api
			.get(`/exercise/completed-exercises/${completedExerciseId}`)
			.set('Authorization', 'Bearer ABC')
			.expect(401)
			.end((err, res) => {
				expect(res.body.message).to.equal('Auth failed')
				done()
			})
	})

	it('should delete exercise', function(done) {
		api
			.delete(`/exercise/exercises/${exerciseId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Exercise deleted')
				done()
			})
	})

	it('should delete completed exercise', function(done) {
		api
			.delete(`/exercise/completed-exercises/${completedExerciseId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Completed exercise deleted')
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
