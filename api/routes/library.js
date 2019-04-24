const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const LibraryController = require('../controllers/library')

router.get('/', checkAuth, LibraryController.books_get_all)
router.post('/', checkAuth, LibraryController.book_create)
router.get('/:bookId', checkAuth, LibraryController.book_get)
router.patch('/:bookId', checkAuth, LibraryController.book_update)
router.delete('/:bookId', checkAuth, LibraryController.book_delete)

module.exports = router
