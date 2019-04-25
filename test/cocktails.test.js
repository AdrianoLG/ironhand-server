const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let cocktailId = ''

describe('Cocktails CRUD', function() {
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

	it('should return an empty cocktail list', function(done) {
		api.get('/cocktails').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('cocktails')
			done()
		})
	})

	it('should create a cocktail', function(done) {
		api
			.post('/cocktails')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Long Island Iced Tea',
				img: 'http://dev.ironhand.com/uploads/cocktails/long-island-iced-tea.jpg',
				ingredients: [
					{
						name: 'Vodka',
						parts: '2/3'
					},
					{
						name: 'Ron blanco',
						parts: '2/3'
					},
					{
						name: 'Ginebra',
						parts: '2/3'
					},
					{
						name: 'Tequila',
						parts: '2/3'
					},
					{
						name: 'Zumo de limón',
						parts: '1/3'
					},
					{
						name: 'Coca-Cola',
						parts: '1/3'
					},
					{
						name: 'Triple seco',
						parts: '2/3'
					},
					{
						name: 'Lima',
						parts: 1
					}
				],
				mixture: [
					'Llenar un vaso de tubo con hielo',
					'Añadir todos los ingredientes',
					'Decorar con lima'
				]
			})
			.expect(201)
			.end((err, res) => {
				cocktailId = res.body.createdCocktail._id
				expect(res.body.message).to.equal('Cocktail created')
				expect(res.body.createdCocktail.name).to.equal('Long Island Iced Tea')
				expect(res.body.createdCocktail.img).to.equal(
					'http://dev.ironhand.com/uploads/cocktails/long-island-iced-tea.jpg'
				)
				expect(res.body.createdCocktail.ingredients).to.be.array()
				expect(res.body.createdCocktail.ingredients).to.be.ofSize(8)
				expect(res.body.createdCocktail.mixture).to.be.array()
				expect(res.body.createdCocktail.mixture).to.be.ofSize(3)
				done()
			})
	})

	it('should update a cocktail', function(done) {
		api
			.patch(`/cocktails/${cocktailId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'img', value: 'http://dev.ironhand.com/uploads/cocktails/long-island-iced-tea.png' }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Cocktail updated')
				done()
			})
	})

	it('should get updated cocktail', function(done) {
		api.get(`/cocktails/${cocktailId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.name).to.equal('Long Island Iced Tea')
			expect(res.body.img).to.equal('http://dev.ironhand.com/uploads/cocktails/long-island-iced-tea.png')
			done()
		})
	})

	it('should fail to get cocktail with wrong ID', function(done) {
		api.get('/cocktails/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No cocktail with that ID')
			done()
		})
	})

	it('should fail to get cocktail if no user ID is present', function(done) {
		api.get(`/cocktails/${cocktailId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete cocktail task', function(done) {
		api.delete(`/cocktails/${cocktailId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Cocktail deleted')
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
