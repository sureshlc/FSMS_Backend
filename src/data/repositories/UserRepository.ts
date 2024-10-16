import pgQuery from "../../helper/PgQuery";
import jwtService from "../../services/jwtService";
import { ResultType } from "../../types/result";
import User from "../models/userModel";

class UserRepo {
    async create(user: User) {
        const hashedPassword = await jwtService.passwordEncrypt(user.password);
        const userData = {
            username: user.username,
            email: user.email,
            password: hashedPassword,
        };
        const response = await pgQuery.create("users", userData);
        return response;
    }

    async findUserById(userId: number) {
        const response = await pgQuery.findById("users", { id: userId });
        if (response.success) {
            let data = response.data;
            delete data.password;
            return data;
        } else {
            return response.message;
        }
    }

    async findUserByEmail(email: string): Promise<ResultType> {
        const response = await pgQuery.findUnique("users", [
            { column: "email", value: email },
        ]);
        if (response.success) {
            return {
                success: true,
                message: "Date fetched",
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: response.message,
            };
        }
    }
}

export default new UserRepo();
