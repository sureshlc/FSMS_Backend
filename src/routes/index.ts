import express from "express";
import AuthRouter from "./AuthRouter";
import CountryRouter from "./CountryRouter";
const router = express.Router();

router.use(AuthRouter.router);
router.use(CountryRouter.router);

export default router;
