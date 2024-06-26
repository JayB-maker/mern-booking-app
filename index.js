import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/Connect.js";
import userRouter from "./routes/UserRoutes.js";
import petRouter from "./routes/PetRoutes.js";
import { errorHandler } from "./middleware/ErrorMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || "8080";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", async (req, res) => {
  res.send("Hello darling");
});

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/pet", petRouter);

app.use(errorHandler)

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
