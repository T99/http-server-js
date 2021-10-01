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
		
	}
	
	public static fromNodeServerResponse(request: http.IncomingMessage,
										 response: http.ServerResponse,
										 sourceServer: HTTPServer): OutgoingHTTPResponse {
		
		let protocol: string = "encrypted" in request.socket ? "https" : "http";
		
		return new OutgoingHTTPResponse({
			version: sourceServer.getHTTPVersion(),
			method: request.method as string,
			url: new URL(request.url as string, `${protocol}://${request.headers.host}`),
			statusCode: HTTPStatusCode.HTTP_OK,
			originalResponse: response,
			sourceServer
		});
		
	}
	
	public hasBeenSent(): boolean {
		
		return false;
		
	}
	
	public timeSent(): number | undefined {
		
		return undefined;
		
	}
	
	public send(): Promise<void> {
		
		if (this.hasBeenSent()) return Promise.resolve();
		
		return Promise.resolve(undefined);
		
	}
	
}
