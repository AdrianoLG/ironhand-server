const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let todoId = ''

describe('Todos CRUD', function() {
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

	it('should return an empty todo list', function(done) {
		api.get('/todos').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('todos')
			done()
		})
	})

	it('should create a todo task', function(done) {
		api
			.post('/todos')
			.set('Authorization', `Bearer ${token}`)
			.send({ name: 'Revisar aceite', category: 'Coche', priority: 8 })
			.expect(201)
			.end((err, res) => {
				todoId = res.body.createdTodo._id
				expect(res.body.message).to.equal('Todo created')
				expect(res.body.createdTodo.name).to.equal('Revisar aceite')
				expect(res.body.createdTodo.category).to.equal('Coche')
				expect(res.body.createdTodo.priority).to.equal(8)
				done()
			})
	})

	it('should update a todo task', function(done) {
		api
			.patch(`/todos/${todoId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'priority', value: 9 }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Todo updated')
				done()
			})
	})

	it('should get updated todo task', function(done) {
		api.get(`/todos/${todoId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.name).to.equal('Revisar aceite')
			expect(res.body.priority).to.equal(9)
			done()
		})
	})

	it('should fail to get todo task with wrong ID', function(done) {
		api.get('/todos/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No todo with that ID')
			done()
		})
	})

	it('should fail to get todo task if no user ID is present', function(done) {
		api.get(`/todos/${todoId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete todo task', function(done) {
		api.delete(`/todos/${todoId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Todo deleted')
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
