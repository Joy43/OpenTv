import { Router } from "express";
import { authControllers } from "./auth.controller";
import validateRequest from "../../utils/validateRequest";
import { authValidation } from "./auth.validation";

import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const route = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "user@example.com"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 */
route.post(
  "/login",
  validateRequest(authValidation.loginValidationSchema),
  authControllers.loginUser
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "user@gmail.com"
 *               password: "user123456"
 *     responses:
 *       201:
 *         description: User registered successfully
 */
route.post(
  "/register",
  validateRequest(authValidation.registrationValidationSchema),
  authControllers.registerNewUser
);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               oldPassword: "oldpassword123"
 *               newPassword: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
route.post(
  "/change-password",
  validateRequest(authValidation.changePasswordSchema),
  authControllers.changePasswordWithOldPassword
);

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent
 */
route.post(
  "/forget-password",
  validateRequest(authValidation.forgetPasswordSchema),
  authControllers.forgetPassword
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               id: "user-id-here"
 *               token: "reset-token-here"
 *               newPassword: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
route.post(
  "/reset-password",
  validateRequest(authValidation.resetPasswordSchema),
  authControllers.resetPassword
);

/**
 * @swagger
 * /auth/get-me:
 *   get:
 *     summary: Get current user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details retrieved
 */
route.get(
  "/get-me",
  auth(UserRole.ADMIN, UserRole.PREMIUM, UserRole.USER),
  authControllers.getMe
);

/**
 * @swagger
 * /auth/generate-access-token:
 *   post:
 *     summary: Generate a new access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             example:
 *               refreshToken: "refresh-token-here"
 *     responses:
 *       200:
 *         description: Access token generated successfully
 */
route.post("/generate-access-token", authControllers.generateAccessToken);

export const authRoute = route;
