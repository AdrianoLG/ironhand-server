const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const RehearsalsController = require('../controllers/rehearsals')

router.get('/', checkAuth, RehearsalsController.rehearsals_get_all)
router.post('/', checkAuth, RehearsalsController.rehearsal_create)
router.get('/:rehearsalId', checkAuth, RehearsalsController.rehearsal_get)
router.patch('/:rehearsalId', checkAuth, RehearsalsController.rehearsal_update)
router.delete('/:rehearsalId', checkAuth, RehearsalsController.rehearsal_delete)

module.exports = router
