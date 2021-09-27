import { AbstractRouter } from "./abstract-router";

export class SimpleRouter extends AbstractRouter {
	
	public shouldRoute(request: HTTPRequest): Promise<boolean> {
		
		return Promise.resolve(false);
		
	}
	
}
