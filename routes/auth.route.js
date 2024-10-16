const express = require("express");
const REQ_SCHEMA = require("../models/index.schema");
const router = express.Router();
const { validateRequestBody } = require("../middleware/validator");
const { signUp, login } = require("../controllers/auth.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         username: "user"
 *         email: "user@example.com"
 *         password: "password"
 *       required:
 *         - username
 *         - email
 *         - password
 */

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "user created successfully"
 *                 status:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid request body"
 *                     details:
 *                       type: string
 *                       example: "\"password\" is required"
 *                 status:
 *                   type: integer
 *                   example: 400
 */

router.post("/signUp", validateRequestBody(REQ_SCHEMA.AUTH.signUpUser), signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               username: "john12"
 *               password: "password"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: user1
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOi2IUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXIiOiJ0ZXN0IiwiaWF0IjoxNzEwNjgwMzUxLCJleHAiOjE3MTA2OTExNTF9.Vmy_lGa0D4goe1QWENw74iM6fMT0-PUE0vtxNMTLObU
 *                 status:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid request body"
 *                     details:
 *                       type: string
 *                       example: "\"password\" is required"
 *                 status:
 *                   type: integer
 *                   example: 400
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Invalid username or password
 *                     status:
 *                       type: integer
 *                       example: 401
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to log in user
 */

router.post("/login", validateRequestBody(REQ_SCHEMA.AUTH.loginUser), login);

module.exports = router;
