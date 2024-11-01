import { body } from "express-validator";

export const registerValidator = [
	body("firstName")
		.notEmpty()
		.withMessage("First name is required")
		.isString()
		.withMessage("First name must be a string"),

	body("lastName").notEmpty().withMessage("Last name is required").isString().withMessage("Last name must be a string"),

	body("email").isEmail().withMessage("Valid email is required"),

	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long")
		.matches(/\d/)
		.withMessage("Password must contain at least one number")
		.matches(/[A-Z]/)
		.withMessage("Password must contain at least one uppercase letter"),

	body("address").notEmpty().withMessage("Address is required").isString().withMessage("Address must be a string"),
];
