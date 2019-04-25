const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let cleaningTaskId = ''

describe('Cleanup CRUD', function() {
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

	it('should return an empty cleaning task list', function(done) {
		api.get('/cleanup').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('cleaningTasks')
			done()
		})
	})

	it('should create a cleaning task', function(done) {
		api
			.post('/cleanup')
			.set('Authorization', `Bearer ${token}`)
			.send({
				place: 'Habitación',
				date: '2019-03-14T12:00:00',
				tasks: [
					'Barrer',
					'Polvo',
					'Cambio sábanas'
				]
			})
			.expect(201)
			.end((err, res) => {
				cleaningTaskId = res.body.createdCleaningTask._id
				expect(res.body.message).to.equal('Cleaning task created')
				expect(res.body.createdCleaningTask.place).to.equal('Habitación')
				expect(res.body.createdCleaningTask.date).to.equal('2019-03-14T12:00:00')
				expect(res.body.createdCleaningTask.tasks).to.be.array()
				expect(res.body.createdCleaningTask.tasks).to.be.ofSize(3)
				done()
			})
	})

	it('should update a cleaning task', function(done) {
		api
			.patch(`/cleanup/${cleaningTaskId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{
					propName: 'tasks',
					value: [
						'Barrer'
					]
				}
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Cleaning task updated')
				done()
			})
	})

	it('should get updated cleaning task', function(done) {
		api.get(`/cleanup/${cleaningTaskId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.place).to.equal('Habitación')
			expect(res.body.tasks).to.be.ofSize(1)
			done()
		})
	})

	it('should fail to get cleaning task with wrong ID', function(done) {
		api.get('/cleanup/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No cleaning task with that ID')
			done()
		})
	})

	it('should fail to get cleaning task if no user ID is present', function(done) {
		api.get(`/cleanup/${cleaningTaskId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete cleaning task', function(done) {
		api.delete(`/cleanup/${cleaningTaskId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Cleaning task deleted')
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
