const supertest = require('supertest')
const api = supertest('http://192.168.1.43:32776')
const chai = require('chai')
const assertArrays = require('chai-arrays')

const expect = chai.expect
chai.use(assertArrays)

let token = ''
let id = ''
let plantId = ''

describe('Plants CRUD', function() {
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

	it('should return an empty list of plants', function(done) {
		api.get('/plants').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('plants')
			done()
		})
	})

	it('should create a plant', function(done) {
		api
			.post('/plants')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Menta',
				scientific: 'Mentha suaveolens',
				container: 'Maceta naranja',
				zone: 'Terraza norte',
				gallery: [
					'http://dev.ironhand.com/uploads/plants/menta-1-01.jpg',
					'http://dev.ironhand.com/uploads/plants/menta-1-02.jpg',
					'http://dev.ironhand.com/uploads/plants/menta-1-03.jpg'
				],
				sun: 'Sombra',
				watering: [
					{ date: '2019-03-09T17:00:00', fertilizer: false },
					{ date: '2019-03-11T21:00:00', fertilizer: false },
					{ date: '2019-03-13T21:00:00', fertilizer: false },
					{ date: '2019-03-15T21:00:00', fertilizer: false },
					{ date: '2019-03-17T21:00:00', fertilizer: true }
				],
				wateringFrequency: 'Alto',
				frost: false,
				soil: 'Calcáreo, fértil y húmedo',
				flowering: 'Verano',
				perishable: true,
				pests: [],
				img: 'http://dev.ironhand.com/uploads/plants/menta01.jpg',
				origin: [],
				transplant: [
					'2019-02-11T00:00:00'
				],
				death: '2019-08-91T00:00:00',
				deathCause: 'Deshidratación'
			})
			.expect(201)
			.end((err, res) => {
				plantId = res.body.createdPlant._id
				expect(res.body.message).to.equal('Plant created')
				expect(res.body.createdPlant.name).to.equal('Menta')
				expect(res.body.createdPlant.scientific).to.equal('Mentha suaveolens')
				expect(res.body.createdPlant.container).to.equal('Maceta naranja')
				expect(res.body.createdPlant.zone).to.equal('Terraza norte')
				expect(res.body.createdPlant.gallery).to.be.array()
				expect(res.body.createdPlant.gallery).to.be.ofSize(3)
				expect(res.body.createdPlant.sun).to.equal('Sombra')
				expect(res.body.createdPlant.watering).to.be.array()
				expect(res.body.createdPlant.watering).to.be.ofSize(5)
				expect(res.body.createdPlant.wateringFrequency).to.equal('Alto')
				expect(res.body.createdPlant.frost).to.equal(false)
				expect(res.body.createdPlant.soil).to.equal('Calcáreo, fértil y húmedo')
				expect(res.body.createdPlant.flowering).to.equal('Verano')
				expect(res.body.createdPlant.perishable).to.equal(true)
				expect(res.body.createdPlant.pests).to.be.array()
				expect(res.body.createdPlant.pests).to.be.ofSize(0)
				expect(res.body.createdPlant.img).to.be.equal('http://dev.ironhand.com/uploads/plants/menta01.jpg')
				expect(res.body.createdPlant.origin).to.be.array()
				expect(res.body.createdPlant.origin).to.be.ofSize(0)
				expect(res.body.createdPlant.origin).to.be.array()
				expect(res.body.createdPlant.transplant).to.be.ofSize(1)
				expect(res.body.createdPlant.death).to.equal('2019-08-91T00:00:00')
				expect(res.body.createdPlant.deathCause).to.equal('Deshidratación')
				done()
			})
	})

	it('should update a plant', function(done) {
		api
			.patch(`/plants/${plantId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'deathCause', value: 'Tormenta' }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Plant updated')
				done()
			})
	})

	it('should get updated plant', function(done) {
		api.get(`/plants/${plantId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.name).to.be.equal('Menta')
			expect(res.body.deathCause).to.be.equal('Tormenta')
			done()
		})
	})

	it('should fail to get plant with wrong ID', function(done) {
		api.get('/plants/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No plant with that ID')
			done()
		})
	})

	it('should fail to get plant if no user ID is present', function(done) {
		api.get(`/plants/${plantId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete plant', function(done) {
		api.delete(`/plants/${plantId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Plant deleted')
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
