import { ClientAccessibleError } from "./client-accessible-error";
import { HTTPStatusCode } from "@t99/http";

export class ResourceNotFoundError extends ClientAccessibleError {
	
	// TODO [7/15/2021 @ 10:59 AM] Replace ResourceNotFoundError usages with GenericNotFoundError usages?
	
	public constructor(path: string) {
		
		super(
			HTTPStatusCode.HTTP_NOT_FOUND,
			"RESOURCE_NOT_FOUND",
			`The specified resource (located at: '${path}') could not be found.`,
			"Resource not found!"
		);
		
	}
	
}
