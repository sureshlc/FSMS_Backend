import pgQuery from "../helper/PgQuery";
import { TServiceResponse } from "../types/ServiceResponseTypes/TServiceResponse";
import serviceResponse from "../response/ServiceResponse";
import { staticMessage } from "../config/statics";
import userServiceQuery from "../helper/UserServiceQuery";
import jwtService from "./jwtService";
import { LoginRequest } from "../types/auth/LoginRequest";
import { SignupRequest } from "../types/auth/SignupRequest";
import UserRepository from "../data/repositories/UserRepository";
import User from "../data/models/userModel";
import { number } from "joi";

class UserService {
    login = async ({
        email,
        password,
    }: LoginRequest): Promise<TServiceResponse> => {
        const result = await UserRepository.findUserByEmail(email);
        if (!result.success) {
            return serviceResponse.bad({
                message: "Invalid email",
                statusCode: 400,
            });
        }
        const isPasswordMatch = await jwtService.passwordVerify(
            password,
            result.data!.password
        );
        if (!isPasswordMatch) {
            return serviceResponse.bad({
                message: "Invalid credentials",
                statusCode: 401,
            });
        }
        
        const token = jwtService.jwtSign(
            { email, userId: Number(result.data.id) },
            "24hr"
        );

        return serviceResponse.ok({
            message: staticMessage.LOGIN_SUCCESS,
            data: {
                id: result.data.id,
                username: result.data.username,
                email,
                token,
            },
            statusCode: 200,
        });
    };

    signup = async ({
        username,
        email,
        password,
    }: SignupRequest): Promise<TServiceResponse> => {
        let x = await UserRepository.create(
            new User(username, email, password)
        );

        return serviceResponse.ok({
            message: staticMessage.USER_REGISTERED,
        });
    };

    getUser = async ({ userId }: { userId: number }) => {
        let x = await UserRepository.findUserById(userId);
        return x;
    };
}
const userService = new UserService();
export default userService;
