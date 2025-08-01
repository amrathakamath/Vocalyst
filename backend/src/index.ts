import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { userRouter } from "../routes/user"

dotenv.config()

const app = express();

// Add these missing middleware
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD as string;
const MONGO_URL = process.env.MONGO_URL as string;
const PORT = process.env.PORT || 3000;

app.use("/user", userRouter);

async function main() {
    try {
        if (!MONGO_URL) {
            console.error("[DEBUG] MONGO_URL is not defined in environment variables");
            process.exit(1);
        }

        await mongoose.connect(MONGO_URL);
        console.debug("[DEBUG] Connected to the database");

        const listenPort = PORT ? Number(PORT) : 3000;
        app.listen(listenPort, () => {
            console.debug(`[DEBUG] Server is running on port ${listenPort}`);
        });

    } catch(e){
        console.error("[DEBUG] Failed to connect to the database", e);
    }
}

main();
