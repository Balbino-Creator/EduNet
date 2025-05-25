import { Router } from 'express'
import { createUser, deleteUser, getUserById, getUsers, updtateRole, updtateUser } from './handlers/user'
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from './handlers/project'
import { createClassroom, deleteClassroom, getClassroomById, getClassrooms, updateClassroom } from './handlers/classroom'
import { createChatMessage, deleteChatMessage, getChatMessageById, getChatMessages, updateChatMessage } from './handlers/chatMessage'
import { body, param } from 'express-validator'
import { UserRole } from './models/User.model'
import { handleInputErrors } from './middleware'

const router = Router()

// Users endpoint

router.get('/users', getUsers)

router.get('/users/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    getUserById
)

router.post('/users',
    body('name').notEmpty().withMessage('The name of user cannot be empty'),
    body('last_names').notEmpty().withMessage('The last names of user cannot be empty'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(Object.values(UserRole)).withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
    handleInputErrors,
    createUser
)

router.put('/users/:id',
    param('id').isInt().withMessage('ID not valid'),
    body('name').notEmpty().withMessage('The name of user cannot be empty'),
    body('last_names').notEmpty().withMessage('The last names of user cannot be empty'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(Object.values(UserRole)).withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
    handleInputErrors,
    updtateUser
)

router.patch('/users/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    updtateRole
)

router.delete('/users/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    deleteUser
)

// Projects endpoints
router.get('/projects', getProjects)

router.get('/projects/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    getProjectById
)

router.post('/projects',
    body('name').notEmpty().withMessage('Project name cannot be empty'),
    handleInputErrors,
    createProject
)

router.put('/projects/:id',
    param('id').isInt().withMessage('ID not valid'),
    body('name').notEmpty().withMessage('Project name cannot be empty'),
    handleInputErrors,
    updateProject
)

router.delete('/projects/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    deleteProject
)

// Classrooms endpoints
router.get('/classrooms', getClassrooms)

router.get('/classrooms/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    getClassroomById
)

router.post('/classrooms',
    body('name').notEmpty().withMessage('Classroom name cannot be empty'),
    body('projectId').isInt().withMessage('Project ID must be a valid integer'),
    handleInputErrors,
    createClassroom
)

router.put('/classrooms/:id',
    param('id').isInt().withMessage('ID not valid'),
    body('name').notEmpty().withMessage('Classroom name cannot be empty'),
    handleInputErrors,
    updateClassroom
)

router.delete('/classrooms/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    deleteClassroom
)

// ChatMessages endpoints
router.get('/chatMessages', getChatMessages)

router.get('/chatMessages/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    getChatMessageById
)

router.post('/chatMessages',
    body('message').notEmpty().withMessage('Message cannot be empty'),
    body('userId').isInt().withMessage('User ID must be a valid integer'),
    body('classroomId').isInt().withMessage('Classroom ID must be a valid integer'),
    handleInputErrors,
    createChatMessage
)

router.put('/chatMessages/:id',
    param('id').isInt().withMessage('ID not valid'),
    body('message').notEmpty().withMessage('Message cannot be empty'),
    handleInputErrors,
    updateChatMessage
)

router.delete('/chatMessages/:id',
    param('id').isInt().withMessage('ID not valid'),
    handleInputErrors,
    deleteChatMessage
)

export default router