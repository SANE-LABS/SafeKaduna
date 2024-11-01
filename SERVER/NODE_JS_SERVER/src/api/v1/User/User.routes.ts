import { Router } from "express";
import UserController from "./User.controller";
import RouteErrorHandler from "../../../utils/errorHandler";
import { container } from "tsyringe";
import { body } from "express-validator";
import { registerValidator } from "../../../Validators";

const userController = container.resolve(UserController);
const userRouter: Router = Router();

userRouter.post("/register", registerValidator, RouteErrorHandler(userController.register));
userRouter.get(
	"/contacts/:userId/all",

	RouteErrorHandler(userController.getUserContacts)
);

export default userRouter;
