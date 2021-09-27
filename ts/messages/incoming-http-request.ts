import { AbstractIncomingHTTPRequest, HTTPRequestConfig } from "@t99/http";
import { RoutingInfo } from "../routing/routing-info";

export type IncomingHTTPRequestConfig = HTTPRequestConfig & {
	
	timeReceived?: number
	
}

export class IncomingHTTPRequest extends AbstractIncomingHTTPRequest {
	
	protected timestamp: number;
	
	protected routingInfo: RoutingInfo;
	
	public constructor(config: IncomingHTTPRequestConfig) {
		
		super(config);
		
		this.timestamp = config.timeReceived ?? Date.now();
		this.routingInfo = new RoutingInfo(this.getURL());
		
	}
	
	public timeReceived(): number {
		
		return this.timestamp;
		
	}
	
	public getRoutingInfo(): RoutingInfo {
		
		return this.routingInfo;
		
	}
	
}
