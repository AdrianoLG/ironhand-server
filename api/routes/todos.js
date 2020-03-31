const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const TodosController = require('../controllers/todos')

router.get('/', checkAuth, TodosController.todos_get_all)
router.post('/', checkAuth, TodosController.todo_create)
router.get('/:todoId', checkAuth, TodosController.todo_get)
router.patch('/:todoId', checkAuth, TodosController.todo_update)
router.delete('/', checkAuth, TodosController.todo_delete_completed)
router.delete('/:todoId', checkAuth, TodosController.todo_delete)

module.exports = router
