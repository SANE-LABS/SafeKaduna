import { Router } from "express";
import { container } from "tsyringe";
import AuthController from "./AuthController";
import RouteErrorHandler from "../../../utils/errorHandler";

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post("/login", RouteErrorHandler(authController.login.bind(authController)));
authRouter.post("/logout", RouteErrorHandler(authController.logout.bind(authController)));
// authRouter.post(
// 	"/password/request/reset",
// 	RouteErrorHandler(authController.forgotPasswordRequest.bind(authController))
// );
// authRouter.post("/password/reset", authController.forgotPasswordReset.bind(authController));
export default authRouter;
