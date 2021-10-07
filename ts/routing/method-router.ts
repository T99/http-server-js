import { SimpleStringAbstractRouter } from "./simple-string-abstract-router";
import { IncomingHTTPRequest } from "../messages/incoming-http-request";
import { OutgoingHTTPResponse } from "../messages/outgoing-http-response";

export class MethodRouter extends SimpleStringAbstractRouter {
	
	public static ACL(): MethodRouter {
		
		return new MethodRouter("ACL");
		
	}
	
	public static BIND(): MethodRouter {
		
		return new MethodRouter("BIND");
		
	}
	
	public static CHECKOUT(): MethodRouter {
		
		return new MethodRouter("CHECKOUT");
		
	}
	
	public static CONNECT(): MethodRouter {
		
		return new MethodRouter("CONNECT");
		
	}
	
	public static COPY(): MethodRouter {
		
		return new MethodRouter("COPY");
		
	}
	
	public static DELETE(): MethodRouter {
		
		return new MethodRouter("DELETE");
		
	}
	
	public static GET(): MethodRouter {
		
		return new MethodRouter("GET");
		
	}
	
	public static HEAD(): MethodRouter {
		
		return new MethodRouter("HEAD");
		
	}
	
	public static LINK(): MethodRouter {
		
		return new MethodRouter("LINK");
		
	}
	
	public static LOCK(): MethodRouter {
		
		return new MethodRouter("");
		
	}
	
	public static MSEARCH(): MethodRouter {
		
		return new MethodRouter("M-SEARCH");
		
	}
	
	public static MERGE(): MethodRouter {
		
		return new MethodRouter("MERGE");
		
	}
	
	public static MKACTIVITY(): MethodRouter {
		
		return new MethodRouter("MKACTIVITY");
		
	}
	
	public static MKCALENDAR(): MethodRouter {
		
		return new MethodRouter("MKCALENDAR");
		
	}
	
	public static MKCOL(): MethodRouter {
		
		return new MethodRouter("MKCOL");
		
	}
	
	public static MOVE(): MethodRouter {
		
		return new MethodRouter("MOVE");
		
	}
	
	public static NOTIFY(): MethodRouter {
		
		return new MethodRouter("NOTIFY");
		
	}
	
	public static OPTIONS(): MethodRouter {
		
		return new MethodRouter("OPTIONS");
		
	}
	
	public static PATCH(): MethodRouter {
		
		return new MethodRouter("PATCH");
		
	}
	
	public static POST(): MethodRouter {
		
		return new MethodRouter("POST");
		
	}
	
	public static PROPFIND(): MethodRouter {
		
		return new MethodRouter("PROPFIND");
		
	}
	
	public static PROPPATCH(): MethodRouter {
		
		return new MethodRouter("PROPPATCH");
		
	}
	
	public static PURGE(): MethodRouter {
		
		return new MethodRouter("PURGE");
		
	}
	
	public static PUT(): MethodRouter {
		
		return new MethodRouter("PUT");
		
	}
	
	public static REBIND(): MethodRouter {
		
		return new MethodRouter("REBIND");
		
	}
	
	public static REPORT(): MethodRouter {
		
		return new MethodRouter("REPORT");
		
	}
	
	public static SEARCH(): MethodRouter {
		
		return new MethodRouter("SEARCH");
		
	}
	
	public static SUBSCRIBE(): MethodRouter {
		
		return new MethodRouter("SUBSCRIBE");
		
	}
	
	public static TRACE(): MethodRouter {
		
		return new MethodRouter("TRACE");
		
	}
	
	public static UNBIND(): MethodRouter {
		
		return new MethodRouter("UNBIND");
		
	}
	
	public static UNLINK(): MethodRouter {
		
		return new MethodRouter("UNLINK");
		
	}
	
	public static UNLOCK(): MethodRouter {
		
		return new MethodRouter("UNLOCK");
		
	}
	
	public static UNSUBSCRIBE(): MethodRouter {
		
		return new MethodRouter("UNSUBSCRIBE");
		
	}
	
	protected async supply(request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<string | undefined> {
		
		return request.getMethod().getName();
		
	}
	
}
