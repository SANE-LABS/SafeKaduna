export default abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract message: string;
	abstract errors?: any[];
	constructor() {
		super();
	}
}
