import { ClientAccessibleError } from "./client-accessible-error";
import { HTTPStatusCode } from "@t99/http";

export class InternalServerError<T = undefined> extends ClientAccessibleError {
	
	public readonly originalError?: T;
	
	public constructor(message: string, originalError?: T) {
		
		super(
			HTTPStatusCode.HTTP_INTERNAL_SERVER_ERROR,
			"INTERNAL_SERVER_ERROR",
			"An error occurred on the server that was not at the fault of the client.",
			"An internal error occurred on the server."
		);
		
		this.message = message;
		this.originalError = originalError;
		
	}
	
	// public static fromMySQLError(error: mysql.MysqlError): InternalServerError<mysql.MysqlError> {
	//	
	// 	let errorMessage: string = "MySQL Error: ";
	// 	errorMessage += error.code;
	//	
	// 	if (error?.sqlMessage !== undefined) errorMessage += ` ${error.sqlMessage}`;
	//	
	// 	return new InternalServerError(errorMessage, error);
	//	
	// }
	
}
