const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let rehearsalId = ''

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

	it('should return an empty list of rehearsals', function(done) {
		api.get('/rehearsals').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('rehearsals')
			done()
		})
	})

	it('should create a rehearsal', function(done) {
		api
			.post('/rehearsals')
			.set('Authorization', `Bearer ${token}`)
			.send({
				instrument: 'Guitarra eléctrica',
				time: 30,
				sheets: [
					{
						name: 'Killer of Giants',
						time: 10
					},
					{
						name: 'When Will I See You Again',
						time: 20
					}
				]
			})
			.expect(201)
			.end((err, res) => {
				rehearsalId = res.body.createdRehearsal._id
				expect(res.body.message).to.equal('Rehearsal created')
				expect(res.body.createdRehearsal.instrument).to.equal('Guitarra eléctrica')
				expect(res.body.createdRehearsal.time).to.equal(30)
				expect(res.body.createdRehearsal.sheets).to.be.array()
				expect(res.body.createdRehearsal.sheets).to.be.ofSize(2)
				done()
			})
	})

	it('should update a rehearsal', function(done) {
		api
			.patch(`/rehearsals/${rehearsalId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'time', value: 40 },
				{
					propName: 'sheets',
					value: [
						{
							name: 'Killer of Giants',
							time: 20
						},
						{
							name: 'When Will I See You Again',
							time: 20
						}
					]
				}
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Rehearsal updated')
				done()
			})
	})

	it('should get updated rehearsal', function(done) {
		api.get(`/rehearsals/${rehearsalId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.time).to.equal(40)
			expect(res.body.sheets).to.be.ofSize(2)
			done()
		})
	})

	it('should fail to get rehearsal with wrong ID', function(done) {
		api.get('/rehearsals/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No rehearsal with that ID')
			done()
		})
	})

	it('should fail to get rehearsal if no user ID is present', function(done) {
		api.get(`/rehearsals/${rehearsalId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete rehearsal', function(done) {
		api.delete(`/rehearsals/${rehearsalId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Rehearsal deleted')
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
