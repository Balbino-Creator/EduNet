import { Router } from 'express'
import { createUser } from './handlers/user'
import { body } from 'express-validator'
import { UserRole } from './models/User.model'

const router = Router()

// router.get('/')

router.post('/',
    body('name').notEmpty().withMessage('The name of user cannot be empty'),
    body('last_names').notEmpty().withMessage('The last names of user cannot be empty'),
    body('role')
        .notEmpty().withMessage('Role is required')
        .isIn(Object.values(UserRole)).withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
    createUser
)
// router.patch('/')
// router.delete('/')

export default router