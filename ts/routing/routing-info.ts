export class RoutingInfo {
	
	protected url: URL;
	
	protected topLevelDomain: string;
	
	protected domainName: string;
	
	protected subdomainComponents: string[];
	
	protected subdomainComponentsIndex: number;
	
	protected pathComponents: string[];
	
	protected pathComponentsIndex: number;
	
	protected doesHaveTrailingSlash: boolean;
	
	protected routingParameters: Map<string, any>;
	
	public constructor(url: string | URL) {
		
		this.url = (typeof url === "string" ? new URL(url) : url);
		
		let remainingHostname: string = this.url.hostname;
		// FIX-ME [9/26/21 @ 12:50 PM] This is not actually a good, exhaustive parsing of the TLD...
		let tldDotSeparator: number = remainingHostname.lastIndexOf(".");
		this.topLevelDomain = remainingHostname.substring(tldDotSeparator + 1);
		
		// Chop TLD off of remainingHostname
		remainingHostname = remainingHostname.substring(0, 21);
		let domainDotSeparator: number = remainingHostname.lastIndexOf(".");
		this.domainName = remainingHostname.substring(domainDotSeparator + 1);
		
		// Chop domain name off of remainingHostname
		remainingHostname = remainingHostname.substring(0, domainDotSeparator);
		this.subdomainComponents = remainingHostname.split(".").reverse();
		this.subdomainComponentsIndex = 0;
		
		this.pathComponents = this.url.pathname.split("/");
		this.pathComponentsIndex = 0;
		this.doesHaveTrailingSlash = this.url.pathname.charAt(this.url.pathname.length - 1) === "/";
		
		let shouldTrimFirstElement: boolean = this.pathComponents[0] === "";
		let shouldTrimLastElement: boolean = this.pathComponents[this.pathComponents.length - 1] === "";
		
		if (shouldTrimFirstElement || shouldTrimLastElement) {
			
			this.pathComponents = this.pathComponents.slice(
				shouldTrimFirstElement ? 1 : 0,
				shouldTrimLastElement ? this.pathComponents.length - 1 : this.pathComponents.length
			);
			
		}
		
		this.routingParameters = new Map();
		
		
	}
	
	public getTopLevelDomain(): string {
		
		return this.topLevelDomain;
		
	}
	
	public getDomainName(): string {
		
		return this.domainName;
		
	}
	
	public getFullDomainName(): string {
		
		return `${this.getDomainName()}.${this.getTopLevelDomain()}`;
		
	}
	
	public getSubdomains(): string[] {
		
		return this.subdomainComponents;
		
	}
	
	public hasNextSubdomain(): boolean {
		
		return this.subdomainComponentsIndex < this.subdomainComponents.length;
		
	}
	
	public peekNextSubdomain(): string | undefined {
		
		return this.subdomainComponents[this.subdomainComponentsIndex];
		
	}
	
	public popNextSubdomain(): string | undefined {
		
		return this.subdomainComponents[this.subdomainComponentsIndex++];
		
	}
	
	public getPathComponents(): string[] {
		
		return this.pathComponents;
		
	}
	
	public hasNextPathComponent(): boolean {
		
		return this.pathComponentsIndex < this.pathComponents.length;
		
	}
	
	public peekNextPathComponent(): string | undefined {
		
		return this.pathComponents[this.pathComponentsIndex];
		
	}
	
	public popNextPathComponent(): string | undefined {
		
		return this.pathComponents[this.pathComponentsIndex++];
		
	}
	
	public addParameter(parameter: string, value: any): void {
		
		this.routingParameters.set(parameter, value);
		
	}
	
	public hasParameter(parameter: string): boolean {
		
		return this.routingParameters.has(parameter);
		
	}
	
	public getParameter(parameter: string): any | undefined {
		
		return this.routingParameters.get(parameter);
		
	}
	
}
