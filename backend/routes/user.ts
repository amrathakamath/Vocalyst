import { Router } from "express";
import express from "express"
import jwt from "jsonwebtoken"
import cors from "cors"
import mongoose from "mongoose"
import z from "zod"
import bcrypt from "bcrypt"
import { userModel } from "../src/db";
import dotenv from "dotenv"

dotenv.config()

const userRouter = Router();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

userRouter.use(cors(corsOptions));
userRouter.use(express.json());

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD as string;

// Remove duplicate middleware (you had these twice)
// Debug middleware
userRouter.use((req, res, next) => {
    console.debug(`[DEBUG] [${new Date().toISOString()}] ${req.method} ${req.url} - Body:`, req.body);
    next();
});

//signup endpoint
userRouter.post("/signup", async function (req, res) {
    try {
        console.debug("[DEBUG] Signup request body:", req.body);

        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is required"
            });
        }

        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        // Input validation using zod
        const requiredBody = z.object({
            email: z.string().min(5).max(100).email(),
            password: z.string().min(5).max(100),
            name: z.string().min(3).max(30)
        });
        
        const parsedDataSuccess = requiredBody.safeParse(req.body);

        if (!parsedDataSuccess.success) {
            console.error("[DEBUG] Signup validation failed:", parsedDataSuccess.error);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: parsedDataSuccess.error
            });
        }

        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.debug("[DEBUG] Hashed password for signup:", hashedPassword);

        const user = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        console.debug("[DEBUG] User created:", user);

        res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
        
    } catch(e) {
        console.error("[DEBUG] Error during signup:", e);
        return res.status(400).json({
            success: false,
            message: "You are already signed up",
            //@ts-ignore
            error: e.message || e
        });
    }
});

// Keep your signin endpoint as is...

export { userRouter }
