import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import apiResponse from "../response/ApiResponse";
import { staticMessage } from "../config/statics";

class PayloadValidator {
    public static validate<T>(schema: Schema<T>) {
        return (req: Request, res: Response, next: NextFunction) => {
            const { error } = schema.validate(req.body, { abortEarly: false });

            if (error) {
                const errors = error.details.map((detail) => detail.message);
                return apiResponse.bad(res, {
                    statusCode: 400,
                    message: staticMessage.VALIDATOR_ERROR,
                    errorStack: errors.join(", "),
                });
            }

            next();
        };
    }
}

export default PayloadValidator;
