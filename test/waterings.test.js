const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let wateringId = ''

describe('Waterings CRUD', function() {
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

	it('should return an empty watering list', function(done) {
		api.get('/waterings').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('waterings')
			done()
		})
	})

	it('should create a watering task', function(done) {
		api
			.post('/waterings')
			.set('Authorization', `Bearer ${token}`)
			.send({
				container: 'Vilma 10',
				date: '2019-03-09T17:00:00',
				fertilizer: {
					grow: 0,
					flower: 60,
					root: 24,
					powerzyme: 0,
					supervit: 5,
					delta9: 0,
					boost: 0,
					pk1314: 0
				}
			})
			.expect(201)
			.end((err, res) => {
				wateringId = res.body.createdWatering._id
				expect(res.body.message).to.equal('Watering created')
				expect(res.body.createdWatering.container).to.equal('Vilma 10')
				expect(res.body.createdWatering.date).to.equal('2019-03-09T17:00:00')
				expect(res.body.createdWatering.fertilizer).to.be.array()
				expect(res.body.createdWatering.fertilizer).to.be.ofSize(1)
				done()
			})
	})

	it('should update a watering task', function(done) {
		api
			.patch(`/waterings/${wateringId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'date', value: '2019-03-10T17:00:00' }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Watering updated')
				done()
			})
	})

	it('should get updated watering', function(done) {
		api.get(`/waterings/${wateringId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.container).to.equal('Vilma 10')
			expect(res.body.date).to.equal('2019-03-10T17:00:00')
			done()
		})
	})

	it('should fail to get watering with wrong ID', function(done) {
		api.get('/waterings/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No watering with that ID')
			done()
		})
	})

	it('should fail to get watering if no user ID is present', function(done) {
		api.get(`/waterings/${wateringId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete watering', function(done) {
		api.delete(`/waterings/${wateringId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Watering deleted')
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
