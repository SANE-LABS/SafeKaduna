import { body } from "express-validator";

export const loginValidator = [
	body("email").isEmail().withMessage("Valid email is required"),

	body("password").notEmpty().withMessage("Password is required"),
];
