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
	
	public attachMiddlewareAtBeginning: MiddlewareRegistrationFunction;
	public attachMiddlewareBeforeHandler: MiddlewareRegistrationFunction;
	public attachMiddlewareAfterHandler: MiddlewareRegistrationFunction;
	public attachMiddlewareAtEnd: MiddlewareRegistrationFunction;
	
	protected constructor() {
		
		this.middlewareManager = new MiddlewareManager();
		
		this.attachMiddlewareAtBeginning = (middleware) => this.middlewareManager.attachMiddlewareAtBeginning(middleware);
		this.attachMiddlewareBeforeHandler = (middleware) => this.middlewareManager.attachMiddlewareBeforeHandler(middleware);
		this.attachMiddlewareAfterHandler = (middleware) => this.middlewareManager.attachMiddlewareAfterHandler(middleware);
		this.attachMiddlewareAtEnd = (middleware) => this.middlewareManager.attachMiddlewareAtEnd(middleware);
		
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
	
	/**
	 * Prepares/modifies the request and response objects in whatever way is necessary to be routed this by router.
	 * 
	 * This function is run at the very beginning of the routing process of this router, and often serves as a special
	 * sort of Middleware function.
	 * 
	 * @param {IncomingHTTPRequest} request The HTTP request that is being routed by this router.
	 * @param {OutgoingHTTPResponse} response The HTTP response associated with the provided HTTP request object. 
	 * @returns {Promise<void>} A Promise that resolves once this function is finished preparing the request/response
	 * pair.
	 */
	protected async onRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> {
		
		return;
		
	}
	
	public async route(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> {
		
		// Run the internal 'pre-routing' handler for this router.
		await this.onRoute(request, response);
		
		// Run the pre-handler middleware(s).
		await this.middlewareManager.executePreHandlerMiddleware(request, response);
		
		let didRoutingContinue: boolean = false;
		
		// Search for a sub-route to further route the request.
		for (let i: number = 0; i < this.routes.length && !response.hasBeenSent(); i++) {
			
			if (await this.routes[i].shouldRoute(request, response)) {
				
				didRoutingContinue = true;
				
				await this.routes[i].route(request, response);
				
			}
			
		}
		
		// If a sub-route was not found to further route/handle the request, let this router deal with it.
		if (!didRoutingContinue) {
			
			if (await request.getRecipientServer().checkRequestFulfillment(request, response) && this.hasHandler()) {
				
				await this.handle(request, response);
				
			} else await request.getRecipientServer().handleUnhandledRequest(request, response);
			
		}
		
		// Run the post-handler middleware(s).
		await this.middlewareManager.executePostHandlerMiddleware(request, response);
		
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
