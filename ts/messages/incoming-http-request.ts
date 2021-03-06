import http from "http";
import { AbstractIncomingHTTPRequest, HTTPRequestConfig, HTTPHeadersManager } from "@t99/http";
import { RoutingInfo } from "../routing/routing-info";
import { HTTPServer } from "../http-server";
import { ClientAccessibleError } from "../error/client-accessible-error";
import { InternalServerError } from "../error/internal-server-error";

export type IncomingHTTPRequestConfig = HTTPRequestConfig & {
	
	timeReceived?: number,
	
	originalRequest: http.IncomingMessage,
	
	recipientServer: HTTPServer
	
};

export class IncomingHTTPRequest extends AbstractIncomingHTTPRequest {
	
	protected timestamp: number;
	
	protected originalRequest: http.IncomingMessage;
	
	protected recipientServer: HTTPServer;
	
	protected routingInfo: RoutingInfo;
	
	protected hasBodyBeenRead: boolean;
	
	public readonly middlewareData: Map<string, any>;
	
	public constructor(config: IncomingHTTPRequestConfig) {
		
		super(config);
		
		this.timestamp = config.timeReceived ?? Date.now();
		this.originalRequest = config.originalRequest;
		this.recipientServer = config.recipientServer;
		this.routingInfo = new RoutingInfo(this.getURL());
		this.hasBodyBeenRead = false;
		this.middlewareData = new Map();
		
	}
	
	public static fromNodeIncomingMessage(request: http.IncomingMessage,
										  response: http.ServerResponse,
										  recipientServer: HTTPServer,
										  timestamp: number = Date.now()): IncomingHTTPRequest {
		
		let protocol: string = "encrypted" in request.socket ? "https" : "http";
		let headers: HTTPHeadersManager = new HTTPHeadersManager();
		
		for (let i: number = 0; i < request.rawHeaders.length; i += 2) {
			
			headers.setHeader(request.rawHeaders[i], request.rawHeaders[i + 1]);
			
		}
		
		return new IncomingHTTPRequest({
			version: {
				major: request.httpVersionMajor.toString(),
				minor: request.httpVersionMinor.toString()
			},
			method: request.method as string,
			url: new URL(request.url as string, `${protocol}://${request.headers.host}`),
			headers,
			timeReceived: timestamp,
			originalRequest: request,
			recipientServer
		});
		
	}
	
	public timeReceived(): number {
		
		return this.timestamp;
		
	}
	
	public async getBody(): Promise<any> {
		
		if (!this.hasBodyBeenRead) {
			
			this.body = await new Promise<any>((resolve: (value: any) => void,
												reject: (reason: ClientAccessibleError) => void): void => {
				
				let incomingBody: string = "";
				
				this.originalRequest.on("error", (error: Error): void => {
					
					reject(new InternalServerError(error.message, error));
					
				});
				
				this.originalRequest.on("data", (chunk: any): any => incomingBody += chunk);
				
				this.originalRequest.on("end", (): void => resolve(incomingBody));
				
			});
			
			this.hasBodyBeenRead = true;
			
		}
		
		return this.body;
		
	}
	
	/**
	 * Returns the {@link HTTPServer} instance that received (and is therefore handling) this request.
	 *
	 * @returns {HTTPServer} The {@link HTTPServer} instance that received (and is therefore handling) this request.
	 */
	public getRecipientServer(): HTTPServer {
		
		return this.recipientServer;
		
	}
	
	public getRoutingInfo(): RoutingInfo {
		
		return this.routingInfo;
		
	}
	
}
