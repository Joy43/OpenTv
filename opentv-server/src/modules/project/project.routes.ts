import express from 'express';
import { projectController } from './project.controller';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router=express.Router();

/**
 * @swagger
 * /project/{projectId}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               tvurl:
 *                 type: string
 *             example:
 *               title: "Updated Title"
 *               description: "Updated description"
 *               image: "http://example.com/image.png"
 *               tvurl: "http://example.com/tv"
 *     responses:
 *       200:
 *         description: Project updated successfully
 */
router.put('/:projectId', auth(UserRole.USER, UserRole.ADMIN, UserRole.PREMIUM), projectController.UpdateProject);

/**
 * @swagger
 * /project:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               tvurl:
 *                 type: string
 *             example:
 *               title: "New Project"
 *               description: "Project description"
 *               image: "http://example.com/image.png"
 *               tvurl: "http://example.com/tv"
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post('/', auth(UserRole.USER, UserRole.ADMIN, UserRole.PREMIUM), projectController.createProject);

/**
 * @swagger
 * /project:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 */
router.get('/',projectController.getAllProject);

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     summary: Get a single project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Single project details
 */
router.get("/:id",projectController.getSingleProject);

/**
 * @swagger
 * /project/{projectId}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 */
router.delete('/:projectId', auth(UserRole.USER, UserRole.ADMIN, UserRole.PREMIUM), projectController.DeleteProject);

export const Projectrouter=router;