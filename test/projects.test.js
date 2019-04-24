const supertest = require('supertest')
const api = supertest('http://192.168.1.43:32776')
const chai = require('chai')
const assertArrays = require('chai-arrays')

const expect = chai.expect
chai.use(assertArrays)

let token = ''
let id = ''
let projectId = ''

describe('Project CRUD', function() {
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

	it('should return an empty project list', function(done) {
		api.get('/projects').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('projects')
			done()
		})
	})

	it('should create a project task', function(done) {
		api
			.post('/projects')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Iron Hand',
				category: 'Código',
				todo: [
					'Front - Diseño gráfico',
					'Front - Configuración Angular, AngularNG, Jasmine, Karma y Protractor',
					'Front - Meter frontend en contenedor de Docker en NAS',
					'Front - Desarrollar rutas y componentes',
					'Front - Desarrollar home'
				],
				doing: [
					'Back - Desarrollar API'
				],
				done: [
					'Back - Configuración Node, Express, Mocha, Chai y Supertest',
					'Back - Meter backend en contenedor de Docker en NAS',
					'Back - Diseño lógico, API con Swagger'
				]
			})
			.expect(201)
			.end((err, res) => {
				projectId = res.body.createdProject._id
				expect(res.body.message).to.equal('Project created')
				expect(res.body.createdProject.name).to.equal('Iron Hand')
				expect(res.body.createdProject.category).to.equal('Código')
				expect(res.body.createdProject.todo).to.be.array()
				expect(res.body.createdProject.todo).to.be.ofSize(5)
				expect(res.body.createdProject.doing).to.be.array()
				expect(res.body.createdProject.doing).to.be.ofSize(1)
				expect(res.body.createdProject.done).to.be.array()
				expect(res.body.createdProject.done).to.be.ofSize(3)
				done()
			})
	})

	it('should update a project', function(done) {
		api
			.patch(`/projects/${projectId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'doing', value: [] },
				{
					propName: 'done',
					value: [
						'Back - Configuración Node, Express, Mocha, Chai y Supertest',
						'Back - Meter backend en contenedor de Docker en NAS',
						'Back - Diseño lógico, API con Swagger',
						'Back - Desarrollar API'
					]
				}
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Project updated')
				done()
			})
	})

	it('should get updated project', function(done) {
		api.get(`/projects/${projectId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.doing).to.be.ofSize(0)
			expect(res.body.done).to.be.ofSize(4)
			done()
		})
	})

	it('should fail to get project with wrong ID', function(done) {
		api.get('/projects/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No project with that ID')
			done()
		})
	})

	it('should fail to get project if no user ID is present', function(done) {
		api.get(`/projects/${projectId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete project', function(done) {
		api.delete(`/projects/${projectId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Project deleted')
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
