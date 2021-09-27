import { AbstractRouter } from "./abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export class DomainRouter extends AbstractRouter {
	
	public async shouldRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<boolean> {
		
		// TODO [9/26/21 @ 1:19 AM] Finish me!
		return true;
		
	}
	
}
