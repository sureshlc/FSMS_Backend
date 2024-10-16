import envConfig from "../config/env";
import { jwtPayload, jwtExpireIn, jwtVerifyRes } from "../types/TJwt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class JwtService {
    jwtSign(props: jwtPayload, expireIn: jwtExpireIn): string {
        return jwt.sign(props, envConfig.JWT_SECRET, { expiresIn: expireIn });
    }
    jwtVerify = (token: string): jwtVerifyRes => {
        try {
            const decoded = jwt.verify(token, envConfig.JWT_SECRET);
            return {
                success: true,
                message: "Verified successfully",
                data: decoded,
            };
        } catch (error) {
            const errorTyped = error as Error;
            return {
                success: false,
                message: errorTyped.message,
            };
        }
    };

    passwordEncrypt = async (plainPassword: string): Promise<string> => {
        try {
            const hashedPassword = await bcrypt.hash(plainPassword, 12);
            return hashedPassword;
        } catch (error) {
            throw new Error("Error hashing password");
        }
    };

    passwordVerify = async (
        plainPassword: string,
        hashedPassword: string
    ): Promise<boolean> => {
        try {
            const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatch;
        } catch (error) {
            throw new Error("Error verifying password");
        }
    };
}

const jwtService = new JwtService();

export default jwtService;
