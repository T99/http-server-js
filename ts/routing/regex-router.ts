import { AbstractRouter } from "./abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export class RegexRouter extends AbstractRouter {
	
	public constructor(regex: RegExp) {
		
		super();
		
	}
	
	public shouldRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<boolean> {
		
		return Promise.resolve(false);
		
	}
	
}
