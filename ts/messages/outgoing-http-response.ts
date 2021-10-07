import http from "http";
import { AbstractOutgoingHTTPResponse, HTTPResponseConfig, HTTPStatusCode } from "@t99/http";
import { HTTPServer } from "../http-server";
import { ClientAccessibleError } from "../error/client-accessible-error";
import { InternalServerError } from "../error/internal-server-error";

export type OutgoingHTTPResponseConfig = HTTPResponseConfig & {
	
	originalResponse: http.ServerResponse,
	
	sourceServer: HTTPServer
	
};

export class OutgoingHTTPResponse extends AbstractOutgoingHTTPResponse {
	
	protected timestamp: number | undefined;
	
	protected originalResponse: http.ServerResponse;
	
	protected sourceServer: HTTPServer;
	
	public constructor(config: OutgoingHTTPResponseConfig) {
		
		super(config);
		
		this.originalResponse = config.originalResponse;
		this.sourceServer = config.sourceServer;
		
		this.originalResponse.statusCode = this.getStatusCode().getStatusCode();
		this.originalResponse.statusMessage = this.getStatusCode().getExplanation();
		
	}
	
	public static fromNodeServerResponse(request: http.IncomingMessage,
										 response: http.ServerResponse,
										 sourceServer: HTTPServer): OutgoingHTTPResponse {
		
		let protocol: string = "encrypted" in request.socket ? "https" : "http";
		
		let result: OutgoingHTTPResponse = new OutgoingHTTPResponse({
			version: sourceServer.getHTTPVersion(),
			method: request.method as string,
			url: new URL(request.url as string, `${protocol}://${request.headers.host}`),
			statusCode: HTTPStatusCode.HTTP_OK,
			originalResponse: response,
			sourceServer
		});
		
		return result;
		
	}
	
	public setStatusCode(statusCode: number | HTTPStatusCode): void {
		
		super.setStatusCode(statusCode);
		
		this.originalResponse.statusCode = this.getStatusCode().getStatusCode();
		this.originalResponse.statusMessage = this.getStatusCode().getExplanation();
		
	}
	
	public hasBeenSent(): boolean {
		
		return false;
		
	}
	
	public timeSent(): number | undefined {
		
		return undefined;
		
	}
	
	public async sendError(error: ClientAccessibleError): Promise<void> {
		
		this.setStatusCode(error.getHTTPStatusCode());
		
		if ((this.getMatchingRequest()?.getHeadersManager().getHeader("Accept") ?? []).includes("text/html")) {
			
			let status: HTTPStatusCode = this.getStatusCode();
			
			let titleWords: string[] = status.getTitle(false).split("_");
			
			for (let i: number = 0; i < titleWords.length; i++) {
				
				titleWords[i] = titleWords[i].substr(0, 1) + titleWords[i].substr(1).toLowerCase();
				
			}
			
			let html: string = `
				<h1 title="${status.getExplanation()}">${status.getStatusCode()} - ${titleWords.join(" ")}</h1>
				<p>${error.getUserMessage()}</p>
			`;
			
			if (Object.keys(error.getExtras()).length > 0) {
				
				html += `<pre style="tab-size: 4; -moz-tab-size: 4">`;
				html += `${JSON.stringify(error.getExtras(), null, "\t")}`;
				html += `</pre>`;
				
			}
			
			this.getHeadersManager().setHeader("Content-Type", "text/html");
			this.setBody(html);
			
		} else {
			
			this.getHeadersManager().setHeader("Content-Type", "application/json");
			this.setBody({
				error: {
					title: error.getErrorTitle(),
					developerMessage: error.getDeveloperMessage(),
					userMessage: error.getUserMessage(),
					...error.getExtras()
				}
			});
			
		}
		
		await this.send();
		
	}
	
	public getPreparedBody(): string {
		
		let bodyType: string = typeof this.body;
		
		switch (bodyType) {
			
			case "string":
				return this.body;
			
			case "object":
			case "boolean":
			case "number":
				return JSON.stringify(this.body);
			
			case "function":
			case "bigint":
			case "symbol":
				return this.body.toString();
			
			case "undefined":
				// throw new InternalServerError("Attempted to send undefined body to client.");
				return "";
			
			default:
				throw new InternalServerError(`Attempted to send body of unknown type ('${bodyType}') to ` +
					`client.`);
			
		}
	
	}
	
	public send(): Promise<void> {
		
		if (this.hasBeenSent()) return Promise.resolve();
		
		this.timestamp = Date.now();
		
		return new Promise<void>((resolve: () => void, reject: (reason?: any) => void): void => {
			
			this.originalResponse.on("error", (error: Error): void => {
				
				reject(new InternalServerError("Error with client response.", error));
				
			});
			
			// If the data is being piped from an outside source...
			// if (this.contentOriginStream !== undefined) {
			//
			// 	this.contentOriginStream.on("open", (): void => {
			//
			// 		this.contentOriginStream?.pipe(this.internalResponse);
			//
			// 	});
			//
			// 	this.contentOriginStream.on("end", (): void => {
			//
			// 		this.contentOriginStream?.close();
			// 		this.internalResponse.end((): void => resolve());
			//
			// 	});
			//
			// } else {
			
			this.originalResponse.write(this.getPreparedBody(), (error: Error | null | undefined): void => {
				
				if (error !== null && error !== undefined) {
					
					reject(new InternalServerError("Error writing body to client.", error));
					
				}
				
				this.originalResponse.end((): void => resolve());
				
			});
			
			// }
		
		});
		
	}
	
}
