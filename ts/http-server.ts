import http from "http";
import { AbstractRouter } from "./routing/abstract-router";
import { IncomingHTTPRequest } from "./messages/incoming-http-request";
import { OutgoingHTTPResponse } from "./messages/outgoing-http-response";

export class HTTPServer extends AbstractRouter {

	protected server: http.Server;
	
	public constructor() {
		
		super();
		
		this.server = http.createServer();
		
		this.server.on("request", (rawRequest: http.IncomingMessage, rawResponse: http.ServerResponse): void => {
		
			let request: IncomingHTTPRequest = IncomingHTTPRequest.fromNodeIncomingMessage(rawRequest);
			let response: OutgoingHTTPResponse = OutgoingHTTPResponse.fromNodeServerResponse(rawResponse);
		
		});
		
	}

}
