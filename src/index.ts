import express from "express";
import envConfig from "./config/env";
import Migrate from "./libs/migrate";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import router from "./routes";
import ErrorHandler from "./middleware/ErrorHandler";
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1", router);

// Global error
app.use(ErrorHandler.handleError);

app.listen(envConfig.PORT, async () => {
    const migrator = Migrate.getInstance();
    // await migrator.undo();
    await migrator.do();
    // await migrator.seed();
    console.log(`Server is running on http://localhost:${envConfig.PORT}`);
});
