import { Router } from "express";
import * as pingController from "../controllers/ping.js";
import * as authController from "../controllers/auth.js";
import * as privateController from "../controllers/private.js"
import { verifyJWT } from "../libs/jwt.js";

export const mainRouter = Router()

mainRouter.get("/ping", pingController.ping);

mainRouter.post("/auth/signin", authController.signin);
mainRouter.post("/auth/signup", authController.signup)

mainRouter.post("/auth/useotp", authController.useOTP)

mainRouter.get("/private", verifyJWT, privateController.teste)