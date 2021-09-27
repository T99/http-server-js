import { MiddlewareExecutor } from "./middleware-executor";
import { Middleware } from "./middleware";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export class MiddlewareManager implements MiddlewareExecutor {
	
	/**
	 * An array of Middleware objects that should be executed before passing the request on to the handler.
	 */
	protected preHandlerMiddleware: Middleware[];
	
	/**
	 * An array of Middleware objects that should be executed after passing the request on to the handler, but before
	 * the response is sent to the client (in most cases).
	 */
	protected postHandlerMiddleware: Middleware[];
	
	public constructor() {
		
		this.preHandlerMiddleware = [];
		this.postHandlerMiddleware = [];
		
	}
	
	/**
	 * Executes the Middleware that is intended to run before this HTTPRoutableNode's #handler method.
	 *
	 * @param {IncomingHTTPRequest} request A mutable representation of the incoming request from the client.
	 * @param {OutgoingHTTPResponse} response A mutable representation of the response being prepared for the client.
	 */
	public async executePreHandlerMiddleware(request: IncomingHTTPRequest,
											 response: OutgoingHTTPResponse): Promise<void> {
		
		for (let i: number = 0; i < this.preHandlerMiddleware.length && !response.hasBeenSent(); i++) {
			
			await this.preHandlerMiddleware[i].execute(request, response);
			
		}
		
	}
	
	/**
	 * Executes the Middleware that is intended to run after this HTTPRoutableNode's #handler method.
	 *
	 * @param {IncomingHTTPRequest} request A mutable representation of the incoming request from the client.
	 * @param {OutgoingHTTPResponse} response A mutable representation of the response being prepared for the client.
	 */
	public async executePostHandlerMiddleware(request: IncomingHTTPRequest,
											  response: OutgoingHTTPResponse): Promise<void> {
		
		for (let i: number = 0; i < this.postHandlerMiddleware.length && !response.hasBeenSent(); i++) {
			
			await this.postHandlerMiddleware[i].execute(request, response);
			
		}
		
	}
	
	public addMiddlewareAtBeginning(middleware: Middleware): void {
		
		this.preHandlerMiddleware.unshift(middleware);
		
	}
	
	public addMiddlewareBeforeHandler(middleware: Middleware): void {
		
		this.preHandlerMiddleware.push(middleware);
		
	}
	
	public addMiddlewareAfterHandler(middleware: Middleware): void {
		
		this.postHandlerMiddleware.unshift(middleware);
		
	}
	
	public addMiddlewareAtEnd(middleware: Middleware): void {
		
		this.postHandlerMiddleware.push(middleware);
		
	}
	 
}
