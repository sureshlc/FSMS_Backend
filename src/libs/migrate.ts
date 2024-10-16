import path from "path";
import Postgrator from "postgrator";
import envConfig from "../config/env";
import PgConfig from "./pg";
import fs from "fs";

const pool = PgConfig.getInstance().getPool();
class Migrate {
    private static instance: Migrate;
    private postgrator: Postgrator;
    private migrationDir: string;
    private seederDir: string;
    private constructor() {
        (this.migrationDir = path.resolve(__dirname, "../../migrations")),
            (this.seederDir = path.resolve(__dirname, "../../migrations/seed")),
            (this.postgrator = new Postgrator({
                migrationPattern: this.migrationDir + "/*",
                driver: "pg",
                database: envConfig.DB_NAME,
                schemaTable: "schema_version",

                execQuery: (query) => pool.query(query),
            }));
    }

    public static getInstance(): Migrate {
        if (!Migrate.instance) {
            Migrate.instance = new Migrate();
        }
        return Migrate.instance;
    }
    public do = async () => {
        if (envConfig.DEBUG) {
            this.postgrator.on("validation-started", (migration) => {
                console.log({ ...migration, event: "validation-started" });
            });
            // this.postgrator.on("validation-finished", (migration) => {
            //     console.log("VF:",migration);
            // });
            this.postgrator.on("migration-started", (migration) => {
                console.log({ ...migration, event: "migration-started" });
            });
            // this.postgrator.on("migration-finished", (migration) => {
            //     console.log("MF:",migration);
            // });
        }
        try {
            console.log("Up Migration Started.");
            await this.postgrator.migrate();
            console.log("Up Migration Ended.");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Up Migration Failed: ${error.message}`);
            } else {
                console.error("An unknown error occurred");
            }
        }
    };

    public undo = async () => {
        try {
            console.log("Down Migration Started.");
            const undoFiles = await this.getFiles("undo");
            for (let undoFile of undoFiles) {
                const sql = await this.loadSqlFile(
                    path.join(this.migrationDir, undoFile)
                );
                let p = await pool.query(sql);
                console.log([p.command, undoFile]);
            }
            const sql = `DROP TABLE IF EXISTS schema_version;`;

            let p = await pool.query(sql);
            console.log([p.command, "Table schema_version"]);
            console.log("Down Migration Ended.");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Down Migration Failed: ${error.message}`);
            } else {
                console.error("An unknown error occurred");
            }
        }
    };

    public seed = async () => {
        try {
            console.log("Seeder Started.");
            const seedFiles = await this.getFiles("seed");
            for (let seedFile of seedFiles) {
                const sql = await this.loadSqlFile(
                    path.join(this.seederDir, seedFile)
                );
                let p = await pool.query(sql);
                console.log([p.command, seedFile]);
            }
            console.log("Seeder Ended.");
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Seeder Failed: ${error.message}`);
            } else {
                console.error("An unknown error occurred");
            }
        }
    };

    private async getFiles(textInclude: "undo" | "seed"): Promise<string[]> {
        try {
            const files = await fs.promises.readdir(
                textInclude === "seed" ? this.seederDir : this.migrationDir
            );
            const filesStr = files.filter((file) =>
                file.includes(`.${textInclude}.`)
            );
            return filesStr;
        } catch (error) {
            console.error("Error reading directory: ", error);
            return [];
        }
    }
    private loadSqlFile = async (filePath: string): Promise<string> => {
        return await fs.promises.readFile(filePath, "utf8");
    };
}

export default Migrate;
