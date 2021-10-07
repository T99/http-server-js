import { SimpleStringAbstractRouter } from "./simple-string-abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export class PathRouter extends SimpleStringAbstractRouter {
	
	protected async onRoute(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> {
		
		await super.onRoute(request, response);
		
		request.getRoutingInfo().popNextPathComponent();
		
	}
	
	protected async supply(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<string | undefined> {
		
		return request.getRoutingInfo().peekNextPathComponent();
		
	}
	
}
