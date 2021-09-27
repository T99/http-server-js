import { SimpleStringAbstractRouter } from "./simple-string-abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export class PathRouter extends SimpleStringAbstractRouter {
	
	protected async supply(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<string> {
		
		request.get
		
	}
	
}
