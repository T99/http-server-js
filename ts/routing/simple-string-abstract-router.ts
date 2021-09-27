import { MatcherFunction, SimpleAbstractRouter } from "./simple-abstract-router";
import objectContaining = jasmine.objectContaining;

export abstract class SimpleStringAbstractRouter extends SimpleAbstractRouter<string> {
	
	protected constructor(content: string, parameter?: string);
	protected constructor(regex: RegExp, parameter?: string);
	protected constructor(matcher: MatcherFunction<string>, parameter?: string);
	protected constructor(arg: string | RegExp | MatcherFunction<string>, parameter?: string) {
		
		let contentOrMatcher: string | MatcherFunction<string>;
		
		if (typeof arg === "object") {
			
			contentOrMatcher = (content: string) => arg.test(content);
			
		} else contentOrMatcher = arg;
		
		super(arg, parameter);
		
	}
	
}
