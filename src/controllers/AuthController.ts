import { NextFunction, Request, Response } from "express";
import apiResponse from "../response/ApiResponse";
import { LoginRequest } from "../types/auth/LoginRequest";
import { SignupRequest } from "../types/auth/SignupRequest";
import userService from "../services/UserService";

class AuthController {
    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const body: LoginRequest = req.body;
            const response = await userService.login(body);
            if (!response.success) {
                return apiResponse.bad(res, {
                    message: response.message,
                    statusCode: response.statusCode,
                });
            }

            return apiResponse.ok(res, {
                message: response.message,
                statusCode: response.statusCode,
                data: response.data,
            });
        } catch (error) {
            return apiResponse.bad(res, {
                statusCode: 400,
                message: String(error),
            });
        }
    }
    public async signup(req: Request, res: Response): Promise<Response> {
        try {
            const body: SignupRequest = req.body;
            await userService.signup(body);
            return apiResponse.ok(res);
        } catch (error) {
            return apiResponse.bad(res, {
                statusCode: 400,
                message: String(error),
            });
        }
    }
    public async getUser(req: Request, res: Response): Promise<Response> {
        try {
            
            let x = await userService.getUser({ userId: req.body.id });

            return apiResponse.ok(res, { data: x });
        } catch (error) {
            return apiResponse.bad(res, {
                statusCode: 400,
                message: String(error),
            });
        }
    }
}

export default new AuthController();
