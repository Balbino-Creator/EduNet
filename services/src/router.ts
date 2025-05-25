import { Router } from 'express'
import { createUser, deleteUser, getUserById, getUsers, updtateRole, updtateUser } from './handlers/user'
import { createProject, deleteProject, getProjectById, getProjects, updateProject } from './handlers/project'
import { createClassroom, deleteClassroom, getClassroomById, getClassrooms, updateClassroom } from './handlers/classroom'
import { createChatMessage, deleteChatMessage, getChatMessageById, getChatMessages, updateChatMessage } from './handlers/chatMessage'
import { body, param } from 'express-validator'
import { UserRole } from './models/User.model'
import { handleInputErrors } from './middleware'

const router = Router()
/**
 * @swagger
 * components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The User ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The user's name
 *                      example: John Doe
 *                  last_names:
 *                      type: string
 *                      description: The user's last names
 *                      example: Smith
 *                  role:
 *                      type: string
 *                      enum: [TEACHER, STUDENT]
 *                      description: User role
 *                      example: TEACHER
 *          Project:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: Project ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: Project name
 *                      example: Science Lab
 *          Classroom:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: Classroom ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: Classroom name
 *                      example: Math 101
 *                  projectId:
 *                      type: integer
 *                      description: Associated project ID
 *                      example: 1
 *          ChatMessage:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: Message ID
 *                      example: 1
 *                  userId:
 *                      type: integer
 *                      description: Sender User ID
 *                      example: 2
 *                  classroomId:
 *                      type: integer
 *                      description: Classroom ID where message was sent
 *                      example: 1
 *                  message:
 *                      type: string
 *                      description: Message content
 *                      example: "Hello everyone!"
 */

// Users endpoint

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Returns the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *   delete:
 *     tags: [Users]
 *     summary: Delete user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

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

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Get all projects
 *     responses:
 *       200:
 *         description: Returns the list of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 *
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *   put:
 *     tags: [Projects]
 *     summary: Update project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Project not found
 *   delete:
 *     tags: [Projects]
 *     summary: Delete project by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */

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

/**
 * @swagger
 * /api/classrooms:
 *   get:
 *     tags: [Classrooms]
 *     summary: Get all classrooms
 *     responses:
 *       200:
 *         description: Returns the list of classrooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Classroom'
 *   post:
 *     tags: [Classrooms]
 *     summary: Create a new classroom
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Classroom'
 *     responses:
 *       201:
 *         description: Classroom created successfully
 *       400:
 *         description: Invalid input
 *
 * /api/classrooms/{id}:
 *   get:
 *     tags: [Classrooms]
 *     summary: Get classroom by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns classroom details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       404:
 *         description: Classroom not found
 *   put:
 *     tags: [Classrooms]
 *     summary: Update classroom by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Classroom'
 *     responses:
 *       200:
 *         description: Classroom updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Classroom not found
 *   delete:
 *     tags: [Classrooms]
 *     summary: Delete classroom by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Classroom deleted successfully
 *       404:
 *         description: Classroom not found
 */

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

/**
 * @swagger
 * /api/chatMessages:
 *   get:
 *     tags: [ChatMessages]
 *     summary: Get all chat messages
 *     responses:
 *       200:
 *         description: Returns the list of chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChatMessage'
 *   post:
 *     tags: [ChatMessages]
 *     summary: Create a new chat message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *     responses:
 *       201:
 *         description: Chat message created successfully
 *       400:
 *         description: Invalid input
 *
 * /api/chatMessages/{id}:
 *   get:
 *     tags: [ChatMessages]
 *     summary: Get chat message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns chat message details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessage'
 *       404:
 *         description: Chat message not found
 *   put:
 *     tags: [ChatMessages]
 *     summary: Update chat message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessage'
 *     responses:
 *       200:
 *         description: Chat message updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Chat message not found
 *   delete:
 *     tags: [ChatMessages]
 *     summary: Delete chat message by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat message deleted successfully
 *       404:
 *         description: Chat message not found
 */

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