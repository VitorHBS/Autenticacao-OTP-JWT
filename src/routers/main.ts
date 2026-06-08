import {Router} from "express";
import * as pingController from "../controllers/ping.js";
import * as authController from "../controllers/auth.js";

export const mainRouter = Router()

mainRouter.get("/ping", pingController.ping);

mainRouter.post("/auth/signin", authController.signin);
mainRouter.post("/signup", authController.signup)

mainRouter.post("/auth/useopt", authController.useOTP)