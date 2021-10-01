import http from "http";
import { HTTPStatusCode } from "@t99/http";
import { AbstractRouter } from "./routing/abstract-router";
import { IncomingHTTPRequest } from "./messages/incoming-http-request";
import { OutgoingHTTPResponse } from "./messages/outgoing-http-response";
import { MiddlewareFunction } from "./middleware/middleware";
import { ClientAccessibleError } from "./error/client-accessible-error";

export async function defaultUnhandledRequestHandler(request: IncomingHTTPRequest,
													 response: OutgoingHTTPResponse): Promise<void> {
	
	if (request.getRoutingInfo().hasNextPathComponent()) {
		
		throw new ClientAccessibleError(
			HTTPStatusCode.HTTP_NOT_FOUND,
			"RESOURCE_NOT_FOUND",
			`The specified resource (located at '${request.getURL().href}') could not be found.`,
			"Resource not found!"
		);
		
	} else {
		
		// TODO [9/30/2021 @ 4:10 PM] I'm not sure this is exhaustively correct...
		throw new ClientAccessibleError(
			HTTPStatusCode.HTTP_METHOD_NOT_ALLOWED,
			"METHOD_NOT_ALLOWED",
			`A ${request.getMethod().getName()} request was made to a valid ('${request.getURL().pathname}'), ` +
			`but the endpoint does not support the attempted HTTP method.`,
			"The requested URL exists, but the server doesn't know how to properly serve your request!"
		);
		
	}
	
}

export class HTTPServer extends AbstractRouter {
	
	protected unhandledRequestHandler: MiddlewareFunction;
	
	protected server: http.Server;
	
	protected constructor() {
		
		super();
		
		this.unhandledRequestHandler = defaultUnhandledRequestHandler;
		
		this.server = http.createServer();
		
		this.server.on("request", (rawRequest: http.IncomingMessage, rawResponse: http.ServerResponse): void => {
		
			let request: IncomingHTTPRequest = IncomingHTTPRequest.fromNodeIncomingMessage(rawRequest, this);
			let response: OutgoingHTTPResponse = OutgoingHTTPResponse.fromNodeServerResponse(rawResponse, this);
			
			this.route(request, response).catch((error: any): void => {
				
				// TODO [9/30/2021 @ 3:16 PM] Properly log the error!
				
			});
		
		});
		
		// TODO [9/30/2021 @ 3:18 PM] Handle `this.server.on("error", () => ...);`
		
	}
	
	public static initialize(port: number): Promise<HTTPServer> {
		
		let server: HTTPServer = new HTTPServer();
		
		return new Promise<HTTPServer>((resolve: (value: HTTPServer) => void,
										reject: (reason?: any) => void): void => {
			
			server.server.listen(port, (): void => resolve(server));
			
		});
		
	}
	
	/**
	 * Attempts to handle a request that has not been fulfilled as a part of the normal router chain, returning a
	 * Promise that resolves once the request has been dealt with.
	 *
	 * Normally, this consists of returning some form of an error to the user, but the actual functionality is
	 * configurable by the end-user via {@link #setUnhandledRequestHandler}, so the actual functionality may vary.
	 *
	 * @param {IncomingHTTPRequest} request The request that has not been fulfilled.
	 * @param {OutgoingHTTPResponse} response The response object matching to the associated request parameter.
	 * @returns {Promise<void>} A Promise that resolves once the request has been dealt with.
	 * @see #setUnhandledRequestHandler
	 */
	public async handleUnhandledRequest(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> {
		
		await this.unhandledRequestHandler(request, response);
		
	}
	
	/**
	 * Sets the handler function to used to handle requests that have not been fulfilled as a part of the normal router
	 * chain.
	 *
	 * @param {MiddlewareFunction} handler
	 */
	public setUnhandledRequestHandler(handler: MiddlewareFunction): void {
		
		this.unhandledRequestHandler = handler;
		
	}

}
