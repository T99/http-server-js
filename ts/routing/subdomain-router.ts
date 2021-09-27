import { SimpleStringAbstractRouter } from "./simple-string-abstract-router";
import { MatcherFunction } from "./simple-abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export class SubdomainRouter extends SimpleStringAbstractRouter {
	
	public constructor(content: string, caseSensitive?: boolean, parameter?: string);
	public constructor(regex: RegExp, parameter?: string);
	public constructor(matcher: MatcherFunction<string | undefined>, parameter?: string);
	public constructor(arg: string | RegExp | MatcherFunction<string | undefined>,
						  parameterOrCaseSensitive?: string | boolean,
						  parameter?: string) {
		
		super(arg, parameterOrCaseSensitive, parameter);
		
		this.addMiddlewareAtBeginning((request: IncomingHTTPRequest): void => {
			
			request.getRoutingInfo().popNextSubdomain();
			
		});
		
	}
	
	protected async supply(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<string | undefined> {
		
		return request.getRoutingInfo().peekNextSubdomain();
		
	}
	
}
