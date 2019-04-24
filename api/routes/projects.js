const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const ProjectsController = require('../controllers/projects')

router.get('/', checkAuth, ProjectsController.projects_get_all)
router.post('/', checkAuth, ProjectsController.project_create)
router.get('/:projectId', checkAuth, ProjectsController.project_get)
router.patch('/:projectId', checkAuth, ProjectsController.project_update)
router.delete('/:projectId', checkAuth, ProjectsController.project_delete)

module.exports = router
