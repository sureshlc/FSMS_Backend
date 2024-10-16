import { Router } from "express";
import authMiddleware from "../middleware/AuthMiddleware";
import AuthController from "../controllers/AuthController";
import PayloadValidator from "../middleware/PayloadValidator";
import { loginSchema } from "../schema/loginSchema";
import { signupSchema } from "../schema/signupSchema";

class AuthRouter {
    public readonly router: Router;
    constructor() {
        this.router = Router();
        this.router.post(
            "/login",
            PayloadValidator.validate(loginSchema),
            AuthController.login
        );
        this.router.post(
            "/signup",
            PayloadValidator.validate(signupSchema),
            AuthController.signup
        );
        this.router.post("/user", AuthController.getUser);
    }
}

export default new AuthRouter();
