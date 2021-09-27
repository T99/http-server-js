import { AbstractRouter } from "./abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export type MatcherFunction<T> = (content: T) => boolean;

export abstract class SimpleAbstractRouter<T> extends AbstractRouter {
	
	protected matcher: MatcherFunction<T>
	
	protected constructor(content: T, parameter?: string);
	protected constructor(matcher: MatcherFunction<T>, parameter?: string);
	protected constructor(arg: string | RegExp | MatcherFunction<T>, parameter?: string) {
		
		super();
		
	}
	
	protected abstract supply(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<T>;
	
	public shouldRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<boolean> {
		
		
		
		return Promise.resolve(false);
		
	}
}
