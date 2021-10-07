/*
 * Created by Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/).
 * 10:53 PM -- June 11th, 2019.
 * Project: <name>
 * 
 * <name> - <desc>
 * Copyright (C) 2021 Trevor Sears
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * NPM main class used for exporting this package's contents.
 *
 * @author Trevor Sears <trevor@trevorsears.com> (https://trevorsears.com/)
 * @version v0.1.0
 * @since v0.1.0
 */

export { ClientAccessibleError } from "./error/client-accessible-error";
export { GenericNotFoundError } from "./error/generic-not-found-error";
export { InternalServerError } from "./error/internal-server-error";
export { ResourceNotFoundError } from "./error/resource-not-found-error";

export { IncomingHTTPRequest, IncomingHTTPRequestConfig } from "./messages/incoming-http-request";
export { OutgoingHTTPResponse, OutgoingHTTPResponseConfig } from "./messages/outgoing-http-response";

export { Middleware, Middlewareable, MiddlewareFunction } from "./middleware/middleware";
export { MiddlewareExecutor, MiddlewareRegistrationFunction } from "./middleware/middleware-executor";
export { MiddlewareManager } from "./middleware/middleware-manager";

export { AbstractRouter } from "./routing/abstract-router";
export { DomainRouter } from "./routing/domain-router";
export { MethodRouter } from "./routing/method-router";
export { PathRouter } from "./routing/path-router";
export { Router } from "./routing/router";
export { RoutingInfo } from "./routing/routing-info";
export { SimpleAbstractRouter, MatcherFunction, MatcherResult } from "./routing/simple-abstract-router";
export { SimpleStringAbstractRouter } from "./routing/simple-string-abstract-router";
export { SubdomainRouter } from "./routing/subdomain-router";

export { JSONObject, JSONMap, JSONArray, JSONLiteral } from "./util/json-types";

export { HTTPServer, defaultUnhandledRequestHandler, defaultRequestFulfillmentChecker } from "./http-server";

// import { HTTPServer } from "./http-server";
// import { IncomingHTTPRequest } from "./messages/incoming-http-request";
// import { OutgoingHTTPResponse } from "./messages/outgoing-http-response";
// import { PathRouter } from "./routing/path-router";
// import { RoutingInfo } from "./routing/routing-info";
// import { AbstractRouter } from "./routing/abstract-router";
//
// export async function main(): Promise<void> {
//	
// 	let server: HTTPServer = await HTTPServer.initialize(3001);
//	
// 	let capture: AbstractRouter = server.attachRouter(new PathRouter("capture"));
//	
// 	capture.attachRouter(new PathRouter(/^\d{1,3}$/, "count")).attachHandler(
// 		async (request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> => {
//			
// 			let routingInfo: RoutingInfo = request.getRoutingInfo();
//			
// 			console.log(`hasParam:`, routingInfo.hasParameter("count"));
// 			console.log(`getParam:`, routingInfo.getParameter("count"));
//			
// 		}
// 	);
//	
// 	capture.attachRouter(new PathRouter(/.+/)).attachHandler(
// 		async (request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> => {
//		
// 			response.setBody("Nope! Didn't match.");
//		
// 		}
// 	);
//	
// 	server.attachHandler((async (request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> => {
//		
// 		let str: string = `${request.getMethod().getName()}: ${request.getURL().href}`;
//		
// 		console.log(str);
// 		response.setBody(str);
//	
// 	}));
//	
// 	server.attachMiddlewareAtEnd(async (request: IncomingHTTPRequest, response: OutgoingHTTPResponse): Promise<void> => {
//		
// 		if (!response.hasBeenSent()) await response.send();
//		
// 	});
//	
// }
//
// main().catch((error: any): void => console.log("ERROR!:", error))
