const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let productId = ''
let mealId = ''
let suggestionId = ''

describe('Food CRUD', function() {
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

	it('should return an empty food products list', function(done) {
		api.get('/food/products').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('products')
			done()
		})
	})

	it('should return an empty food meals list', function(done) {
		api.get('/food/meals').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('meals')
			done()
		})
	})

	it('should return an empty food suggestions list', function(done) {
		api.get('/food/suggestions').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('suggestions')
			done()
		})
	})

	it('should create a food product', function(done) {
		api
			.post('/food/products')
			.set('Authorization', `Bearer ${token}`)
			.set('Content-Type', 'multipart/form-data')
			.field('name', 'Pimientos de piquillo')
			.field('category', 'Conservas')
			.attach('img', 'D:/ADRI/Escritorio/test.png')
			.field('qty', 250)
			.field('unit', 'gramos')
			.field('productQty', 2)
			.field('expiry', '2019-08-09T00:00:00')
			.field('tags', [
				'Pimientos',
				'Conservas'
			])
			.expect(201)
			.end((err, res) => {
				productId = res.body.createdProduct._id
				expect(res.body.message).to.equal('Food product created')
				expect(res.body.createdProduct.name).to.equal('Pimientos de piquillo')
				expect(res.body.createdProduct.category).to.equal('Conservas')
				expect(res.body.createdProduct.img).to.equal('uploads/food-products/test.png')
				expect(res.body.createdProduct.qty).to.equal(250)
				expect(res.body.createdProduct.unit).to.equal('gramos')
				expect(res.body.createdProduct.productQty).to.equal(2)
				expect(res.body.createdProduct.expiry).to.equal('2019-08-09T00:00:00.000Z')
				expect(res.body.createdProduct.tags).to.be.an.instanceof(Array)
				done()
			})
	})

	it('should create a meal', function(done) {
		api
			.post('/food/meals')
			.set('Authorization', `Bearer ${token}`)
			.send({
				breakfast: [
					'Café',
					'Donut'
				],
				lunch: [
					'Lasaña de queso',
					'Plátano'
				],
				dinner: [
					'Huevos fritos',
					'Patatas fritas',
					'Filete de ternera',
					'Yogur de chocolate'
				],
				date: '2019-04-01T22:00:00'
			})
			.expect(201)
			.end((err, res) => {
				mealId = res.body.createdMeal._id
				expect(res.body.message).to.equal('Meal created')
				expect(res.body.createdMeal.breakfast).to.be.an.instanceof(Array)
				expect(res.body.createdMeal.lunch).to.be.an.instanceof(Array)
				expect(res.body.createdMeal.dinner).to.be.an.instanceof(Array)
				expect(res.body.createdMeal.date).to.equal('2019-04-01T22:00:00.000Z')
				done()
			})
	})

	it('should create a suggestion', function(done) {
		api
			.post('/food/suggestions')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Puré de espinacas',
				season: [
					'Primavera',
					'Otoño',
					'Invierno'
				],
				ingredients: [
					'Espinacas',
					'Bechamel',
					'Leche',
					'Sal'
				]
			})
			.expect(201)
			.end((err, res) => {
				suggestionId = res.body.createdSuggestion._id
				expect(res.body.message).to.equal('Suggestion created')
				expect(res.body.createdSuggestion.season).to.be.an.instanceof(Array)
				expect(res.body.createdSuggestion.ingredients).to.be.an.instanceof(Array)
				done()
			})
	})

	it('should update a food product', function(done) {
		api
			.patch(`/food/products/${productId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'name', value: 'Pimientos del piquillo' }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Food product updated')
				done()
			})
	})

	it('should update a meal', function(done) {
		api
			.patch(`/food/meals/${mealId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{
					propName: 'lunch',
					value: [
						'Lasaña de queso'
					]
				}
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Meal updated')
				done()
			})
	})

	it('should update a suggestion', function(done) {
		api
			.patch(`/food/suggestions/${suggestionId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'name', value: 'Puré de patatas' }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Suggestion updated')
				done()
			})
	})

	it('should get updated food product', function(done) {
		api.get(`/food/products/${productId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.name).to.equal('Pimientos del piquillo')
			expect(res.body.qty).to.equal(250)
			done()
		})
	})

	it('should get updated meal', function(done) {
		api.get(`/food/meals/${mealId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.lunch).to.be.ofSize(1)
			done()
		})
	})

	it('should get updated suggestion', function(done) {
		api
			.get(`/food/suggestions/${suggestionId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.name).to.equal('Puré de patatas')
				done()
			})
	})

	it('should fail to get food product with wrong ID', function(done) {
		api.get('/food/products/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No food product with that ID')
			done()
		})
	})

	it('should fail to get meal with wrong ID', function(done) {
		api.get('/food/meals/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No meal with that ID')
			done()
		})
	})

	it('should fail to get suggestion with wrong ID', function(done) {
		api.get('/food/suggestions/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No suggestion with that ID')
			done()
		})
	})

	it('should fail to get food product if no user ID is present', function(done) {
		api.get(`/food/products/${productId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should fail to get meal if no user ID is present', function(done) {
		api.get(`/food/meals/${mealId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should fail to get suggestion if no user ID is present', function(done) {
		api.get(`/food/suggestions/${suggestionId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete food product', function(done) {
		api.delete(`/food/products/${productId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Food product deleted')
			done()
		})
	})

	it('should delete meal', function(done) {
		api.delete(`/food/meals/${mealId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Meal deleted')
			done()
		})
	})

	it('should delete suggestion', function(done) {
		api
			.delete(`/food/suggestions/${suggestionId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Suggestion deleted')
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
