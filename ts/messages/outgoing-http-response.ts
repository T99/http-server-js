import http from "http";
import { AbstractOutgoingHTTPResponse } from "@t99/http";
import { HTTPServer } from "../http-server";

export class OutgoingHTTPResponse extends AbstractOutgoingHTTPResponse {
	
	protected timestamp: number | undefined;
	
	public static fromNodeServerResponse(response: http.ServerResponse,
										 sourceServer: HTTPServer): OutgoingHTTPResponse {
		
		// TODO [9/27/2021 @ 4:16 PM] Finish me!
		return new OutgoingHTTPResponse(undefined as any);
		
	}
	
	public hasBeenSent(): boolean {
		
		return false;
		
	}
	
	public timeSent(): number | undefined {
		
		return undefined;
		
	}
	
	public send(): Promise<void> {
		
		if (this.hasBeenSent()) return Promise.resolve();
		
		return Promise.resolve(undefined);
		
	}
	
}
