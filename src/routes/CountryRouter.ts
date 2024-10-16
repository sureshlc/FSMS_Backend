import { Router } from "express";
import CountryController from "../controllers/CountryController";
import authMiddleware from "../middleware/AuthMiddleware";

class CountryRouter {
    public readonly router: Router;
    constructor() {
        this.router = Router();
        this.router.get(
            "/provinces",
            authMiddleware.authenticate,
            CountryController.getProvinces
        );
    }
}
export default new CountryRouter();
