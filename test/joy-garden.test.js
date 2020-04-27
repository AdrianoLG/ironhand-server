const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let seedId = ''
let plantId = ''

describe('Joy Garden CRUD', function() {
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

	it('should return an empty list of seeds', function(done) {
		api.get('/joy-garden/seeds').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('seeds')
			done()
		})
	})

	it('should return an empty list of plants', function(done) {
		api.get('/joy-garden/plants').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('plants')
			done()
		})
	})

	it('should create a seed', function(done) {
		api
			.post('/joy-garden/seeds')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Pineapple Chunk',
				bank: "Barney's seeds",
				img: 'http://dev.ironhand.com/uploads/joy-garden/seeds/pineapple-chunk-barneys-farm.jpg',
				genetic: 'Pineapple x Skunk #1 x Cheese',
				indicaSativa: '80-20',
				productivity: '600gr/m2',
				flowering: '55-60 días',
				height: 100,
				effect: 'Potente y extremadamente relajante',
				aroma: 'Terroso, piña'
			})
			.expect(201)
			.end((err, res) => {
				seedId = res.body.createdJGSeed._id
				expect(res.body.message).to.equal('JG seed created')
				expect(res.body.createdJGSeed.name).to.equal('Pineapple Chunk')
				expect(res.body.createdJGSeed.bank).to.equal("Barney's seeds")
				expect(res.body.createdJGSeed.img).to.equal(
					'http://dev.ironhand.com/uploads/joy-garden/seeds/pineapple-chunk-barneys-farm.jpg'
				)
				expect(res.body.createdJGSeed.genetic).to.equal('Pineapple x Skunk #1 x Cheese')
				expect(res.body.createdJGSeed.indicaSativa).to.equal('80-20')
				expect(res.body.createdJGSeed.productivity).to.equal('600gr/m2')
				expect(res.body.createdJGSeed.flowering).to.equal('55-60 días')
				expect(res.body.createdJGSeed.height).to.equal(100)
				expect(res.body.createdJGSeed.effect).to.equal('Potente y extremadamente relajante')
				expect(res.body.createdJGSeed.aroma).to.equal('Terroso, piña')
				done()
			})
	})

	it('should create a plant', function(done) {
		api
			.post('/joy-garden/plants')
			.set('Authorization', `Bearer ${token}`)
			.send({
				seedId: seedId,
				name: 'PC#1',
				container: 'Vilma 10',
				coords: '1-1',
				gallery: [
					'http://dev.ironhand.com/uploads/joy-garden/pc1-01.jpg',
					'http://dev.ironhand.com/uploads/joy-garden/pc1-02.jpg',
					'http://dev.ironhand.com/uploads/joy-garden/pc1-03.jpg'
				]
			})
			.expect(201)
			.end((err, res) => {
				plantId = res.body.createdJGPlant._id
				expect(res.body.message).to.equal('JG plant created')
				expect(res.body.createdJGPlant.name).to.equal('PC#1')
				expect(res.body.createdJGPlant.container).to.equal('Vilma 10')
				expect(res.body.createdJGPlant.coords).to.equal('1-1')
				expect(res.body.createdJGPlant.gallery).to.be.array()
				expect(res.body.createdJGPlant.gallery).to.be.ofSize(3)
				done()
			})
	})

	it('should update a seed', function(done) {
		api
			.patch(`/joy-garden/seeds/${seedId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'height', value: 110 }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('JG seed updated')
				done()
			})
	})

	it('should update a plant', function(done) {
		api
			.patch(`/joy-garden/plants/${plantId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'coords', value: '1-2' }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('JG plant updated')
				done()
			})
	})

	it('should get updated seed', function(done) {
		api.get(`/joy-garden/seeds/${seedId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.name).to.equal('Pineapple Chunk')
			expect(res.body.height).to.equal(110)
			done()
		})
	})

	it('should get updated plant', function(done) {
		api.get(`/joy-garden/plants/${plantId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.name).to.equal('PC#1')
			expect(res.body.coords).to.equal('1-2')
			done()
		})
	})

	it('should fail to get seed with wrong ID', function(done) {
		api.get('/joy-garden/seeds/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No JG seed with that ID')
			done()
		})
	})

	it('should fail to get plant with wrong ID', function(done) {
		api.get('/joy-garden/plants/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No JG plant with that ID')
			done()
		})
	})

	it('should fail to get seed if no user ID is present', function(done) {
		api.get(`/joy-garden/seeds/${seedId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should fail to get plant if no user ID is present', function(done) {
		api.get(`/joy-garden/plants/${plantId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete seed', function(done) {
		api.delete(`/joy-garden/seeds/${seedId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('JG seed deleted')
			done()
		})
	})

	it('should delete plant', function(done) {
		api
			.delete(`/joy-garden/plants/${plantId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('JG plant deleted')
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
