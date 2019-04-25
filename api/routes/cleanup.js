const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const CleanupController = require('../controllers/cleanup')

router.get('/', checkAuth, CleanupController.cleaningTasks_get_all)
router.post('/', checkAuth, CleanupController.cleaningTask_create)
router.get('/:cleaningTaskId', checkAuth, CleanupController.cleaningTask_get)
router.patch('/:cleaningTaskId', checkAuth, CleanupController.cleaningTask_update)
router.delete('/:cleaningTaskId', checkAuth, CleanupController.cleaningTask_delete)

module.exports = router
