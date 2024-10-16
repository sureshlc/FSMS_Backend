import { Pool } from "pg";
import envConfig from "../config/env";

class PgConfig {
    private static instance: PgConfig;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            user: envConfig.DB_USER,
            host: envConfig.DB_HOST,
            database: envConfig.DB_NAME,
            password: envConfig.DB_PASSWORD,
            port: envConfig.DB_PORT,
        });
    }

    public static getInstance(): PgConfig {
        if (!PgConfig.instance) {
            PgConfig.instance = new PgConfig();
        }
        return PgConfig.instance;
    }

    public getPool(): Pool {
        return this.pool;
    }
}

export default PgConfig;
