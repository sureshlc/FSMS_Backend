import { NextFunction, Request, Response } from "express";
import apiResponse from "../response/ApiResponse";
import { AppError } from "../errors/AppError";

class ErrorHandler {
    public handleError(
        err: AppError,
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        console.error(err);
        apiResponse.bad(res, {
            message: err.message,
            statusCode: err.statusCode,
            ...(process.env.NODE_ENV === "development" && {
                errorStack: err.stack,
            }),
        });
    }
}

export default new ErrorHandler();
