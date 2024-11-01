import { Router } from "express";
import authRouter from "./Auth/AuthRoutes";
import userRouter from "./User/User.routes";
const v1: Router = Router();

v1.use("/auth", authRouter);
v1.use('/user',userRouter)

export default v1;
