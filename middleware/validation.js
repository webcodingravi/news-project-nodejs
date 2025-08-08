import { body } from 'express-validator'

export const loginValidation=[
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .matches(/^\S+$/)
        .withMessage('Username must not contain spaces')
        .isLength({ min: 5, max: 12 })
        .withMessage('Username must be 5 to 12 characters long'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 5, max: 12 })
        .withMessage('Password must be 5 to 12 characters long')
]


export const UserValidation=[
    body('fullname')
        .trim()
        .notEmpty()
        .withMessage('Fullname is required')
        .isLength({ min: 5, max: 25 })
        .withMessage('Fullname must be 5 to 25 characters long'),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .matches(/^\S+$/)
        .isLength({ min: 5, max: 12 })
        .withMessage('Username must be 5 to 12 characters long'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 5, max: 12 })
        .withMessage('Password must be 5 to 12 characters long'),

    body('role')
        .trim()
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['author', 'admin'])
        .withMessage('Role must be author or admin')
]

export const UserUpdateValidation=[
    body('fullname')
        .trim()
        .notEmpty()
        .withMessage('Fullname is required')
        .isLength({ min: 5, max: 25 })
        .withMessage('Fullname must be 5 to 25 characters long'),

    body('password')
        .optional({ checkFalsy: true })
        .isLength({ min: 5, max: 12 })
        .withMessage('Password must be 5 to 12 characters long'),


    body('role')
        .trim()
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['author', 'admin'])
        .withMessage('Role must be author or admin')


]

export const CategoryValidation=[
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category Name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category Name must be 3 to 100 characters long'),

    body('description')
        .isLength({ max: 100 })
        .withMessage('Description must be at most 100 characters long')


]

export const ArticleValidation=[
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 7, max: 150 })
        .withMessage('Title must be 7 to 150 characters long'),

    body('content')
        .trim()
        .notEmpty()
        .withMessage('Content is required'),


    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),


]


