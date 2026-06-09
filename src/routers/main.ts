import { Router } from "express";
import * as pingController from "../controllers/ping.js";
import * as authController from "../controllers/auth.js";
import * as privateController from "../controllers/private.js"
import { verifyJWT } from "../libs/jwt.js";
import { createRateLimiter } from "../libs/rate-limit.js";

export const mainRouter = Router()

// Rate limiters
const authLimiter = createRateLimiter(60000, 5); // 5 tentativas por minuto

mainRouter.get("/ping", pingController.ping);

mainRouter.post("/auth/signin", authLimiter, authController.signin);
mainRouter.post("/auth/signup", authLimiter, authController.signup)

mainRouter.post("/auth/useotp", authLimiter, authController.useOTP)

mainRouter.get("/private", verifyJWT, privateController.teste)