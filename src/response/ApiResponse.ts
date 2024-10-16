import { Request, Response, NextFunction } from "express";
import { ApiResponse as TApiResponse } from "../types/ApiResponseTypes/ApiResponse";

class ApiResponse {
    public ok = (
        res: Response,
        { message = "Successful", statusCode = 200, data }: TApiResponse = {}
    ): Response => {
        return res.status(statusCode).json({
            message,
            success: true,
            statusCode,
            timestamp: new Date().toISOString(),
            data,
        });
    };

    public bad = (
        res: Response,
        {
            message = "error occurred",
            statusCode = 422,
            errorStack,
            data,
        }: TApiResponse = {}
    ): Response => {
        let errorCode = "";
        switch (statusCode) {
            case 400:
                errorCode = "unexpected_error";
                break;
            case 401:
                errorCode = "unauthorized";
                break;
            case 403:
                errorCode = "not_enough_permissions";
                break;
            case 404:
                errorCode = "not_found";
                break;
            case 409:
                errorCode = "conflict";
                break;
            default:
                errorCode = "internal_server_error";
                break;
        }
        return res.status(statusCode).json({
            message,
            success: false,
            statusCode,
            errorCode,
            errorStack,
            timestamp: new Date().toISOString(),
            ...(data && { data }),
        });
    };
}

const apiResponse = new ApiResponse();

export default apiResponse;
