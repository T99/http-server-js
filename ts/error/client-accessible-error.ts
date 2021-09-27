import { HTTPStatusCode } from "@t99/http";
import { JSONMap } from "../util/json-types";

export class ClientAccessibleError extends Error {
	
	protected httpStatusCode: HTTPStatusCode;
	
	protected errorTitle: string;
	
	protected developerMessage: string;
	
	protected userMessage: string;
	
	protected extras: JSONMap;
	
	public constructor(httpStatusCode: HTTPStatusCode, errorTitle: string, developerMessage: string,
					   userMessage: string, extras: JSONMap = {}) {
		
		super(developerMessage);
		
		this.httpStatusCode = httpStatusCode;
		this.errorTitle = errorTitle;
		this.developerMessage = developerMessage;
		this.userMessage = userMessage;
		this.extras = extras;
		
	}
	
	public getHTTPStatusCode(): HTTPStatusCode {
		
		return this.httpStatusCode;
		
	}
	
	public getErrorTitle(): string {
		
		return this.errorTitle;
		
	}
	
	public getDeveloperMessage(): string {
		
		return this.developerMessage;
		
	}
	
	public getUserMessage(): string {
		
		return this.userMessage;
		
	}
	
	public getExtras(): JSONMap {
		
		return this.extras;
		
	}
	
}
