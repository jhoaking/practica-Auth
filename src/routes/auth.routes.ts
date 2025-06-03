import { Router } from "express";
import { verifyRoute } from "middleware/verifyyToken";
import { authController } from "controller/authController";
import { AuthService } from "service/authService";
import { authClass } from "model/authModel";

const model = new authClass();
const service = new AuthService(model);
const controller = new authController(service)
export const authRouter = Router();

authRouter.get("/auth/logout",controller.logout);
authRouter.get("/auth/protected", verifyRoute,controller.protectedRoute);
authRouter.post("/auth/register",controller.registerUser);
authRouter.post("/auth/login",controller.loginUser);
authRouter.get("/auth/data", verifyRoute,controller.lookAllData);

