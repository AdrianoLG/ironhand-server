const expect = require('chai').expect
const supertest = require('supertest')
const api = supertest(process.env.NODE_HOST)

let token = ''
let id = ''
let bookId = ''

describe('Library CRUD', function() {
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

	it('should return an empty library', function(done) {
		api.get('/library').set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body).to.have.property('count')
			expect(res.body.count).to.equal(0)
			expect(res.body).to.have.property('books')
			done()
		})
	})

	it('should create a book', function(done) {
		api
			.post('/library')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Nocilla Dream',
				author: 'Agustín Fernández Mallo',
				category: 'Novela',
				pages: 253,
				img: 'http://dev.ironhand.com/uploads/library/nocilla-dream-agustin-mallo.jpg',
				read: true,
				readDate: '2019-03-02T15:00:00',
				rating: 6,
				comments: ''
			})
			.expect(201)
			.end((err, res) => {
				bookId = res.body.createdBook._id
				expect(res.body.message).to.equal('Book created')
				expect(res.body.createdBook.title).to.equal('Nocilla Dream')
				expect(res.body.createdBook.author).to.equal('Agustín Fernández Mallo')
				expect(res.body.createdBook.category).to.equal('Novela')
				expect(res.body.createdBook.pages).to.equal(253)
				expect(res.body.createdBook.img).to.equal(
					'http://dev.ironhand.com/uploads/library/nocilla-dream-agustin-mallo.jpg'
				)
				expect(res.body.createdBook.read).to.equal(true)
				expect(res.body.createdBook.readDate).to.equal('2019-03-02T15:00:00')
				expect(res.body.createdBook.rating).to.equal(6)
				expect(res.body.createdBook.comments).to.equal('')
				done()
			})
	})

	it('should update a book', function(done) {
		api
			.patch(`/library/${bookId}`)
			.set('Authorization', `Bearer ${token}`)
			.send([
				{ propName: 'rating', value: 8 }
			])
			.expect(200)
			.end((err, res) => {
				expect(res.body.message).to.equal('Book updated')
				done()
			})
	})

	it('should get updated book', function(done) {
		api.get(`/library/${bookId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.title).to.equal('Nocilla Dream')
			expect(res.body.rating).to.equal(8)
			done()
		})
	})

	it('should fail to get book with wrong ID', function(done) {
		api.get('/library/abc').set('Authorization', `Bearer ${token}`).expect(400).end((err, res) => {
			expect(res.body.message).to.equal('No book with that ID')
			done()
		})
	})

	it('should fail to get book if no user ID is present', function(done) {
		api.get(`/library/${bookId}`).set('Authorization', 'Bearer ABC').expect(401).end((err, res) => {
			expect(res.body.message).to.equal('Auth failed')
			done()
		})
	})

	it('should delete book', function(done) {
		api.delete(`/library/${bookId}`).set('Authorization', `Bearer ${token}`).expect(200).end((err, res) => {
			expect(res.body.message).to.equal('Book deleted')
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
