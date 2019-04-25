const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let recipeeId = ''

describe('Recipees CRUD', function() {
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

	it('should return an empty list of recipees', function(done) {
		api.get('/recipees').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('recipees')
			done()
		})
	})

	it('should create a recipee', function(done) {
		api
			.post('/recipees')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Tortitas',
				img: 'http://dev.ironhand.com/uploads/recipees/tortitas.jpg',
				ingredients: [
					{
						name: 'Harina',
						qty: 100,
						unit: 'gramos'
					},
					{
						name: 'Huevos',
						qty: 1
					},
					{
						name: 'Sal',
						qty: 1,
						unit: 'cucharada'
					},
					{
						name: 'Azúcar',
						qty: 1,
						unit: 'cucharada'
					},
					{
						name: 'Levadura',
						qty: 1,
						unit: 'cucharada'
					},
					{
						name: 'Leche',
						qty: 1,
						unit: 'taza'
					}
				],
				instructions: [
					'Mezclar bien todos los ingredientes',
					'Poner una sartén a fuego medio con una capa de mantequilla',
					'Con una cucharada sopera ir vertiendo contenido a sartén'
				]
			})
			.expect(201)
			.end((err, res) => {
				recipeeId = res.body.createdRecipee._id
				expect(res.body.message).to.equal('Recipee created')
				expect(res.body.createdRecipee.name).to.equal('Tortitas')
				expect(res.body.createdRecipee.img).to.equal('http://dev.ironhand.com/uploads/recipees/tortitas.jpg')
				expect(res.body.createdRecipee.ingredients).to.be.array()
				expect(res.body.createdRecipee.ingredients).to.be.ofSize(6)
				expect(res.body.createdRecipee.instructions).to.be.array()
				expect(res.body.createdRecipee.instructions).to.be.ofSize(3)
				done()
			})
	})

	it('should update a recipee', function(done) {
		api
			.patch(`/recipees/${recipeeId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'name', value: 'Pancakes' }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Recipee updated')
				done()
			})
	})

	it('should get updated recipee', function(done) {
		api.get(`/recipees/${recipeeId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.name).to.equal('Pancakes')
			done()
		})
	})

	it('should fail to get recipee with wrong ID', function(done) {
		api.get('/recipees/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No recipee with that ID')
			done()
		})
	})

	it('should fail to get recipee if no user ID is present', function(done) {
		api.get(`/recipees/${recipeeId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete recipee task', function(done) {
		api.delete(`/recipees/${recipeeId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Recipee deleted')
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
