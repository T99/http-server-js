import { MiddlewareExecutor, MiddlewareRegistrationFunction } from "../middleware/middleware-executor";
import { MiddlewareManager } from "../middleware/middleware-manager";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export abstract class AbstractRouter implements MiddlewareExecutor {
	
	/*
	 * There are only 3 main kinds of request routing:
	 *  - string
	 *  - regex/param (express: '/:id/')
	 *  - file system/file name routing
	 * 
	 *  - do not allow regex without param
	 *  - group neighboring strings into trie?
	 */
	
	/**
	 * A {@link MiddlewareManager} instance responsible for handling/managing the Middleware attached to this
	 * AbstractRouter.
	 */
	protected middlewareManager: MiddlewareManager;
	
	/**
	 * An array of {@link AbstractRouter}s, which serve as sub-routers that will attempt to 
	 */
	protected routes: AbstractRouter[];
	
	public addMiddlewareAtBeginning: MiddlewareRegistrationFunction;
	public addMiddlewareBeforeHandler: MiddlewareRegistrationFunction;
	public addMiddlewareAfterHandler: MiddlewareRegistrationFunction;
	public addMiddlewareAtEnd: MiddlewareRegistrationFunction;
	
	protected constructor() {
		
		this.middlewareManager = new MiddlewareManager();
		
		this.addMiddlewareAtBeginning = this.middlewareManager.addMiddlewareAtBeginning;
		this.addMiddlewareBeforeHandler = this.middlewareManager.addMiddlewareBeforeHandler;
		this.addMiddlewareAfterHandler = this.middlewareManager.addMiddlewareAfterHandler;
		this.addMiddlewareAtEnd = this.middlewareManager.addMiddlewareAtEnd;
		
		this.routes = [];
		
	}
	
	/**
	 * Returns a Promise that will resolve to true if this AbstractRouter instance should take/route the specified HTTP
	 * request.
	 * 
	 * @param {IncomingHTTPRequest} request The HTTP request in question (the request to determine whether or not to
	 * route).
	 * @param {OutgoingHTTPResponse} response The HTTP response associated with the HTTP request in question.
	 * @returns {Promise<boolean>} A Promise that will resolve to true if this AbstractRouter instance should take/route
	 * the specified HTTP request.
	 */
	public abstract shouldRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<boolean>;
	
	public async route(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> {
		
		await this.middlewareManager.executePreHandlerMiddleware(request, response);
		
		for (let i: number = 0; i < this.routes.length && !response.hasBeenSent(); i++) {
			
			if (await this.routes[i].shouldRoute(request, response)) await this.routes[i].route(request, response);
			
		}
		
		await this.middlewareManager.executePostHandlerMiddleware(request, response);
		
	}
	
	/**
	 * Adds a sub-router to this AbstractRouter instance, returning the sub-router to allow for chained calls to this
	 * method.
	 * 
	 * @param {R} router
	 * @returns {R}
	 */
	public addRoute<R extends AbstractRouter>(router: R): R {
		
		this.routes.push(router);
		return router;
		
	}
	
}
