// errors/AppError.js
class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number) {
        super(message);
        this.statusCode = statusCode ?? 422;
        Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidCredentialsError extends AppError {
    constructor() {
        super("Invalid login credentials", 401);
    }
}

class InvalidDataError extends AppError {
    constructor(message: string) {
        super(message || "Invalid data provided", 400);
    }
}

export { AppError, InvalidCredentialsError, InvalidDataError };
