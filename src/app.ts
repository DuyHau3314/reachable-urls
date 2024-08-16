import express from "express";
import "express-async-errors";
import urlRoutes from "./routes/urlRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use("/api", urlRoutes);

app.use(errorHandler);

export default app;
