import http from "http";
import { HTTPStatusCode, HTTPVersionObject } from "@t99/http";
import { AbstractRouter } from "./routing/abstract-router";
import { IncomingHTTPRequest } from "./messages/incoming-http-request";
import { OutgoingHTTPResponse } from "./messages/outgoing-http-response";
import { MiddlewareFunction } from "./middleware/middleware";
import { ClientAccessibleError } from "./error/client-accessible-error";

// TODO [10/1/2021 @ 12:25 PM] Should these two methods be moved somewhere else? Their own file?

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

export async function defaultRequestFulfillmentChecker(request: IncomingHTTPRequest,
													   response: OutgoingHTTPResponse): Promise<boolean> {
	
	return !request.getRoutingInfo().hasNextPathComponent();
	
}

export class HTTPServer extends AbstractRouter {
	
	protected unhandledRequestHandler: MiddlewareFunction;
	
	protected requestFulfillmentChecker: MiddlewareFunction<boolean>;
	
	protected version: HTTPVersionObject;
	
	protected server: http.Server;
	
	protected constructor() {
		
		super();
		
		this.unhandledRequestHandler = defaultUnhandledRequestHandler;
		this.requestFulfillmentChecker = defaultRequestFulfillmentChecker;
		this.version = { major: "1", minor: "1" };
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
	 * Typically, the functionality being provided by this function should match that which is being provided via the
	 * {@link #checkRequestFulfillment} method.
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
	 * Sets the handler function to use to handle requests that have not been fulfilled as a part of the normal router
	 * chain.
	 *
	 * Typically, the functionality being provided by the handler function should match that which is being provided
	 * via the {@link #setRequestFulfillmentChecker} method.
	 *
	 * @param {MiddlewareFunction} handler The handler function to use to handle requests that have not been fulfilled
	 * as a part of the normal router chain.
	 * @see #handleUnhandledRequest
	 */
	public setUnhandledRequestHandler(handler: MiddlewareFunction): void {
		
		this.unhandledRequestHandler = handler;
		
	}
	
	/**
	 * Returns a Promise that resolves to true if the provided request and response pair should be considered 'fully
	 * routed', and should therefore be handled by the handler function associated with the last router to have received
	 * the request.
	 *
	 * Typically, the functionality being provided by this function should match that which is being provided via the
	 * {@link #handleUnhandledRequest} method.
	 *
	 * @param {IncomingHTTPRequest} request The request that is being checked as to whether or not it is fulfilled.
	 * @param {OutgoingHTTPResponse} response The response object matching to the associated request parameter.
	 * @returns {Promise<boolean>} A Promise that resolves to true if the provided request and response pair should be
	 * considered 'fully routed'.
	 * @see #setRequestFulfillmentChecker
	 */
	public async checkRequestFulfillment(request: IncomingHTTPRequest,
										 response: OutgoingHTTPResponse): Promise<boolean> {
		
		return this.requestFulfillmentChecker(request, response);
		
	}
	
	/**
	 * Sets the handler function to use to check whether or not a given request and response pair should be considered
	 * 'fully routed'.
	 *
	 * Typically, the functionality being provided by the handler function should match that which is being provided
	 * via the {@link #setUnhandledRequestHandler} method.
	 *
	 * @param {MiddlewareFunction<boolean>} handler The handler function to use to check whether or not a given request
	 * and response pair should be considered 'fully routed'.
	 * @see #checkRequestFulfillment
	 */
	public setRequestFulfillmentChecker(handler: MiddlewareFunction<boolean>): void {
		
		this.requestFulfillmentChecker = handler;
		
	}
	
	public async shouldRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<boolean> {
		
		return true;
		
	}
	
	public getHTTPVersion(): HTTPVersionObject {
	
		return this.version;
	
	}

}
