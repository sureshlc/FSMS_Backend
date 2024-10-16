import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
    PORT: number;
    DEBUG: boolean;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    JWT_SECRET: string;
}

const envConfig: EnvConfig = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    DEBUG: Boolean(process.env.DEBUG),
    DB_USER: process.env.DB_USER || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_HOST: process.env.DB_HOST || "",
    DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    DB_NAME: process.env.DB_NAME || "",
    JWT_SECRET: process.env.JWT_SECRET || "chatAppSuper@secure#key",
};

export default envConfig;
