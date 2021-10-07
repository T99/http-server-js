import { HTTPStatusCode } from "@t99/http";
import { ClientAccessibleError } from "./client-accessible-error";

export class GenericNotFoundError extends ClientAccessibleError {
	
	/**
	 * Initializes a new GenericNotFoundError instance that communicates to the client that their request failed to
	 *
	 * @param {string} typeName The name of the 'type of thing' that the client was attempting to find.
	 * @param {string} identifier The identifying piece of information provided by the client that failed to identify/
	 * help find the desired resource.
	 */
	public constructor(typeName: string, identifier: string) {
		
		super(
			HTTPStatusCode.HTTP_NOT_FOUND,
			`${typeName.toUpperCase()}_NOT_FOUND`,
			`The given ${typeName} (${identifier}) does not exist.`,
			`The ${typeName} (${identifier}) does not exist!`
		);
		
	}
	
}
