import { AbstractOutgoingHTTPResponse } from "@t99/http";

export class OutgoingHTTPResponse extends AbstractOutgoingHTTPResponse {
	
	protected timestamp: number | undefined;
	
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
