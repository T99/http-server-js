import { AbstractRouter } from "./abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export type MatcherResult<T> = { didMatch: true, match: T } | { didMatch: false, match: undefined };

export type MatcherFunction<T> = (content: T) => MatcherResult<T> | Promise<MatcherResult<T>>;

export abstract class SimpleAbstractRouter<T> extends AbstractRouter {
	
	protected matcher: MatcherFunction<T>
	
	protected parameter?: string;
	
	protected constructor(matcher: MatcherFunction<T>, parameter?: string) {
		
		super();
		
		this.matcher = matcher;
		this.parameter = parameter;
		
	}
	
	protected async onRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> {
		
		await super.onRoute(request, response);
		
		if (this.parameter !== undefined) {
			
			let parameterValue: T = (await this.matcher(await this.supply(request, response))).match as T;
			
			request.getRoutingInfo().setParameter(this.parameter, parameterValue);
			
		}
		
	}
	
	/**
	 * Returns a Promise which resolves to the content on which this SimpleAbstractRouter should operate when deciding
	 * whether or not this router should apply to a given HTTP request.
	 *
	 * For example, if this router routes based on the hostname being queried, this method would return a Promise that
	 * would resolve to the hostname specified by the given request.
	 *
	 * @param {IncomingHTTPRequest} request The request for which this SimpleAbstractRouter is determining whether or
	 * not to route.
	 * @param {OutgoingHTTPResponse} response The response for which this SimpleAbstractRouter is determining whether or
	 * not to route.
	 * @returns {Promise<T>} A Promise which resolves to the content on which this SimpleAbstractRouter should operate.
	 */
	protected abstract supply(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<T>;
	
	public async shouldRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<boolean> {
		
		return (await this.matcher(await this.supply(request, response))).didMatch;
		
	}
}
