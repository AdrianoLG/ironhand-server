const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let drinkId = ''

describe('Drinks CRUD', function() {
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

	it('should return an empty drinks list', function(done) {
		api.get('/drinks').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('drinks')
			done()
		})
	})

	it('should create a drink', function(done) {
		api
			.post('/drinks')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Estrella Galicia 30cl',
				brand: 'Estrella Galicia',
				category: 'Cerveza',
				alcohol: true,
				graduation: 5.5,
				img: 'http://dev.ironhand.com/uploads/drinks/estrella-galicia-30cl.jpg',
				qty: 12,
				unit: 'cl',
				productQty: 2
			})
			.expect(201)
			.end((err, res) => {
				drinkId = res.body.createdDrink._id
				expect(res.body.message).to.equal('Drink created')
				expect(res.body.createdDrink.name).to.equal('Estrella Galicia 30cl')
				expect(res.body.createdDrink.brand).to.equal('Estrella Galicia')
				expect(res.body.createdDrink.category).to.equal('Cerveza')
				expect(res.body.createdDrink.alcohol).to.equal(true)
				expect(res.body.createdDrink.graduation).to.equal(5.5)
				expect(res.body.createdDrink.img).to.equal(
					'http://dev.ironhand.com/uploads/drinks/estrella-galicia-30cl.jpg'
				)
				expect(res.body.createdDrink.qty).to.equal(12)
				expect(res.body.createdDrink.unit).to.equal('cl')
				expect(res.body.createdDrink.productQty).to.equal(2)
				done()
			})
	})

	it('should update a drink', function(done) {
		api
			.patch(`/drinks/${drinkId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'productQty', value: 1 }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Drink updated')
				done()
			})
	})

	it('should get updated drink', function(done) {
		api.get(`/drinks/${drinkId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.name).to.equal('Estrella Galicia 30cl')
			expect(res.body.productQty).to.equal(1)
			done()
		})
	})

	it('should fail to get drink with wrong ID', function(done) {
		api.get('/drinks/abc').set('Authorization', `Bearer ${token}`).expect(404).end((err, res) => {
			expect(res.body.message).to.equal('No drink with that ID')
			done()
		})
	})

	it('should fail to get drink if no user ID is present', function(done) {
		api.get(`/drinks/${drinkId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete drink', function(done) {
		api.delete(`/drinks/${drinkId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Drink deleted')
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
