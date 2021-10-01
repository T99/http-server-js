import { MiddlewareExecutor, MiddlewareRegistrationFunction } from "../middleware/middleware-executor";
import { MiddlewareManager } from "../middleware/middleware-manager";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";
import { MiddlewareFunction } from "../middleware/middleware";

export abstract class AbstractRouter implements MiddlewareExecutor {
	
	/**
	 * A {@link MiddlewareManager} instance responsible for handling/managing the Middleware attached to this
	 * AbstractRouter.
	 */
	protected middlewareManager: MiddlewareManager;
	
	/**
	 * An array of {@link AbstractRouter}s, which serve as sub-routers that will attempt to further route requests.
	 */
	protected routes: AbstractRouter[];
	
	protected handler: MiddlewareFunction | undefined;
	
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
	
	/**
	 * Chains the given AbstractRouter instances together, adding them together and returning the 'tail' of the chain of
	 * added AbstractRouters.
	 *
	 * @param {AbstractRouter[]} routers A list of AbstractRouter instances that should be chained together.
	 * @returns {AbstractRouter} The 'tail' of the chain of added AbstractRouters.
	 */
	public attachRouter(...routers: [AbstractRouter, ...AbstractRouter[]]): AbstractRouter {
		
		let tailRouter: AbstractRouter = this;
		
		for (let router of routers) {
			
			tailRouter.routes.push(router);
			tailRouter = router;
			
		}
		
		return tailRouter;
		
	}
	
	public async route(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> {
		
		// Run the pre-handler middleware(s).
		await this.middlewareManager.executePreHandlerMiddleware(request, response);
		
		// Search for a sub-route to further route the request.
		for (let i: number = 0; i < this.routes.length && !response.hasBeenSent(); i++) {
			
			if (await this.routes[i].shouldRoute(request, response)) {
				
				await this.routes[i].route(request, response);
				
				await this.middlewareManager.executePostHandlerMiddleware(request, response);
				
				return;
				
			}
			
		}
		
		if (await request.getRecipientServer().checkRequestFulfillment(request, response) && this.hasHandler()) {
			
			await this.handle(request, response);
			
		} else await request.getRecipientServer().handleUnhandledRequest(request, response);
		
	}
	
	/**
	 * Returns true if this AbstractRouter instance currently has an attached handler function to handle requests that
	 * terminate at this router.
	 *
	 * @returns {boolean} true if this AbstractRouter instance currently has an attached handler function.
	 */
	public hasHandler(): boolean {
		
		return (this.handler !== undefined);
		
	}
	
	/**
	 * Attaches the provided function to this AbstractRouter instance, utilizing it as the primary handler for requests
	 * that terminate at this router.
	 *
	 * @param {MiddlewareFunction | undefined} handler The handler function to attach to this AbstractRouter instance,
	 * or undefined to 'delete'/'remove' the handler currently attached to this router.
	 */
	public attachHandler(handler: MiddlewareFunction | undefined): void {
		
		this.handler = handler;
		
	}
	
	/**
	 * Detaches/removes the handler from this AbstractRouter instance.
	 *
	 * Equivalent to calling `attachHandler(undefined)`.
	 */
	public detachHandler(): void {
		
		this.handler = undefined;
		
	}
	
	public async handle(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> {
		
		if (this.handler !== undefined) return await this.handler(request, response);
		else throw new Error("Attempted to handle incoming request with handler-less AbstractRouter instance.");
		
	}
	
}
