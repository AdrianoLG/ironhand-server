const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest('http://192.168.1.43:32776')

let token = ''
let id = ''

describe('FOOD - Get food products', function() {
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

	it('should return a 200 response', function(done) {
		api.get('/food').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body).to.have.property('products')
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
