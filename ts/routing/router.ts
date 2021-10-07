import { AbstractRouter } from "./abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

/**
 * An implementation of the AbstractRouter class that implicitly routes any incoming requests.
 * 
 * @author Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/)
 * @version v0.1.0
 * @since v0.1.0
 */
export class Router extends AbstractRouter {
	
	public constructor() {
		
		super();
		
	}
	
	public async shouldRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<boolean> {
		
		return true;
		
	}
	
}
