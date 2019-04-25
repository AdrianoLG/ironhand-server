const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)
const chai = require('chai')
const assertArrays = require('chai-arrays')

const expect = chai.expect
chai.use(assertArrays)

let token = ''

describe('USER - Test user does not exist', function() {
	it('should return a 401 response', function(done) {
		api.get('/food/products').set('Accept', 'application/json').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})
})

describe('USER - Test user register', function() {
	it('should create a test user', function(done) {
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
				done()
			})
	})
})

describe('USER - Test user login', function() {
	it('should login test user', function(done) {
		api
			.post('/user/login')
			.set('Accept', 'application/json')
			.send({
				email: 'testuser@gmail.com',
				password: '123'
			})
			.expect(200)
			.end((err, res) => {
				token = res.body.token
				expect(res.body.message).to.equal('Logged in')
				done()
			})
	})
})

describe('USER - Test user does exist', function() {
	it('should return a 200 response', function(done) {
		api.get('/food/products').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.count).to.equal(0)
			done()
		})
	})
})

describe('USER - Remove test user', function() {
	let id = ''
	it('should get the test user id', function(done) {
		api
			.post('/user/id')
			.send({
				token: token
			})
			.expect(200)
			.end((err, res) => {
				id = res.body.userId
				expect(res.body).to.have.property('userId')
				done()
			})
	})
	it('should remove the test user', function(done) {
		api.delete(`/user/${id}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('User deleted')
			done()
		})
	})
})
