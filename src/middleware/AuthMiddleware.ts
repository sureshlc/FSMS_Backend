import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import apiResponse from "../response/ApiResponse";
import envConfig from "../config/env";

class AuthMiddleware {
    authenticate(req: Request, res: Response, next: NextFunction): void {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                apiResponse.bad(res, {
                    message: "Invalid token",
                    statusCode: 401,
                });
                return;
            }

            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(
                token,
                envConfig.JWT_SECRET
            ) as JwtPayload;
            (req as any).currentUserId = decoded.userId;
            next();
        } catch (error) {
            apiResponse.bad(res, {
                message: `Unauthorized access ${String(error)}`,
                statusCode: 403,
            });
            return;
        }
    }
}

const authMiddleware = new AuthMiddleware();

export default authMiddleware;
