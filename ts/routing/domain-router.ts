import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";
import { SimpleStringAbstractRouter } from "./simple-string-abstract-router";

export class DomainRouter extends SimpleStringAbstractRouter {
	
	protected async supply(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<string | undefined> {
		
		return request.getRoutingInfo().getFullDomainName();
		
	}
	
}
