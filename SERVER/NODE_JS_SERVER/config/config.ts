import dotenv from "dotenv";
dotenv.config();
const environment = process.env.NODE_ENV || "development";
const getMongoUri = () => process.env[`${environment.toUpperCase().trim()}_MONGO_URI`];

export const config = {
	port: process.env.PORT || 3000,
	NODE_ENV: environment,
	JWT: {
		accessToken: {
			secret: process.env.ACCESS_TOKEN_SECRET ?? "",
			exp: process.env.ACCESS_TOKEN_EXP ?? "30m",
		},
		refreshToken: {
			secret: process.env.REFRESH_TOKEN_SECRET ?? "",
			exp: process.env.REFRESH_TOKEN_EXP ?? "1w",
		},
	},
	db: {
		mongo_uri: getMongoUri() || "mongodb://localhost:27017/testdb",
	},
	email: {
		SMTP_HOST: process.env.EMAIL_SMTP_HOST?.trim(),
		user: process.env.EMAIL_USER?.trim(),
		password: process.env.EMAIL_PASS?.trim(),
		url: process.env.FRONTEND_URL?.trim() || "/",
	},
};

//template by solomonsolomonsolomon

export default config;
