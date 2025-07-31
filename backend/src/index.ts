import express from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import mongoose from "mongoose"
import z from "zod"
import bcrypt from "bcrypt"
import { userModel } from "./db"
import dotenv from "dotenv"
dotenv.config()

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD as string;
const MONGO_URL = process.env.MONGO_URL as string;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

// Debug: Log when server starts
console.debug("[DEBUG] Server is starting...");

// Debug: Log all incoming requests
app.use((req, res, next) => {
    console.debug(`[DEBUG] [${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
    next();
});

app.post("/signup", async function (req, res) {
    // Debug: Log request body for signup
    console.debug("[DEBUG] Signup request body:", req.body);

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    // Input validation using zod
    const requiredBody = z.object({
        email: z.string().min(5).max(100).email(),
        password: z.string().min(5).max(100),
        username: z.string().min(3).max(30)
    });
    const parsedDataSuccess = requiredBody.safeParse(req.body);

    if (!parsedDataSuccess.success) {
        console.error("[DEBUG] Signup validation failed:", parsedDataSuccess.error);
        return res.json({
            message: "Incorrect format",
            error: parsedDataSuccess.error
        });
    }
    try {
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Debug: Log hashed password
        console.debug("[DEBUG] Hashed password for signup:", hashedPassword);

        const user = await userModel.create({
            username: username,
            email : email,
            password : hashedPassword
        });

        // Debug: Log created user
        console.debug("[DEBUG] User created:", user);

        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                email: user.email,
                //@ts-ignore
                username: user.username
            }
        });
    }
    catch(e){
        // If there is an error during user creation, return a error message
        //@ts-ignore
        console.error("[DEBUG] Error during signup:", e);
        return res.status(400).json({
            message: "You are already signup",
            //@ts-ignore
            error: e.message || e
        });
    }
});

app.post("/signin", async function (req, res) {
    // Debug: Log request body for signin
    console.debug("[DEBUG] Signin request body:", req.body);

    const requireBody = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });
    const parsedDataWithSuccess = requireBody.safeParse(req.body);

    if (!parsedDataWithSuccess.success) {
        console.error("[DEBUG] Signin validation failed:", parsedDataWithSuccess.error);
        return res.json({
            message: "Incorrect Data Format",
            error: parsedDataWithSuccess.error,
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await userModel.findOne({
            email: email,
        });

        // Debug: Log user lookup result
        console.debug("[DEBUG] User found for signin:", user);

        if (!user) {
            console.warn("[DEBUG] Signin failed: Incorrect credentials (user not found)");
            return res.status(403).json({
                message: "Incorrect Credentials !"
            });
        }

        // Ensure password exists
        if (!user.password) {
            console.warn("[DEBUG] Signin failed: User has no password");
            return res.status(403).json({
                message: "Invalid credentials!"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        // Debug: Log password match result
        console.debug("[DEBUG] Password match:", passwordMatch);

        if (passwordMatch) {
            if (!JWT_USER_PASSWORD) {
                console.error("[DEBUG] JWT_USER_PASSWORD is not defined in environment variables");
                return res.status(500).json({
                    message: "Internal server error"
                });
            }
            const token = jwt.sign({
                id: user._id
            }, JWT_USER_PASSWORD);

            // Debug: Log generated token
            console.debug("[DEBUG] JWT token generated:", token);

            res.json({
                token: token,
            });

        } else {
            console.warn("[DEBUG] Signin failed: Invalid credentials (password mismatch)");
            res.status(403).json({
                message: "Invalid credentials!"
            });
        }
        
    } catch (e) {
        console.error("[DEBUG] Error during signin:", e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

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
        // Log an error message if the connection to the database fails
        console.error("[DEBUG] Failed to connect to the database", e);
    }
}
main();