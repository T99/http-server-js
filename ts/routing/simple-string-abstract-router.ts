import { MatcherFunction, SimpleAbstractRouter } from "./simple-abstract-router";

export abstract class SimpleStringAbstractRouter extends SimpleAbstractRouter<string | undefined> {
	
	/**
	 * Initializes a new SimpleStringAbstractRouter instance that matches against the specified string, with optional
	 * case sensitivity and parameterization.
	 *
	 * @param {string} content The string that will be matched against the return value of {@link #supply}.
	 * @param {boolean | undefined} caseSensitive An optional parameter indicating whether or not the matching process
	 * should be case sensitive (defaults to true - case sensitive).
	 * @param {string | undefined} parameter An optional parameter indicating the name of the parameter inside which the
	 * matched content will be stored on a given request's {@link RoutingInfo}.
	 */
	public constructor(content: string, caseSensitive?: boolean, parameter?: string);
	
	/**
	 * Initializes a new SimpleStringAbstractRouter instance that matches against the specified regular expression, with
	 * optional parameterization.
	 *
	 * @param {RegExp} regex The regular expression that will be matched against the return value of {@link #supply}.
	 * @param {string | undefined} parameter An optional parameter indicating the name of the parameter inside which the
	 * matched content will be stored on a given request's {@link RoutingInfo}.
	 */
	public constructor(regex: RegExp, parameter?: string);
	
	/**
	 * Initializes a new SimpleStringAbstractRouter instance that uses the provided {@link MatcherFunction} to test for
	 * matches, with optional parameterization.
	 *
	 * @param {MatcherFunction<string | undefined>} matcher The function that will be used to test if a given return
	 * value of {@link #supply} should cause this router to route the given request + response pair.
	 * @param {string | undefined} parameter An optional parameter indicating the name of the parameter inside which the
	 * matched content will be stored on a given request's {@link RoutingInfo}.
	 */
	public constructor(matcher: MatcherFunction<string | undefined>, parameter?: string);
	
	/**
	 * Initializes a new SimpleStringAbstractRouter instance that uses the provided content to match against the return
	 * value of {@link #supply}, with optional parameterization.
	 *
	 * @param {string | RegExp | MatcherFunction<string | undefined>} arg See specified implementation for more info.
	 * @param {string | boolean | undefined} parameterOrCaseSensitive See specified implementation for more info.
	 * @param {string | undefined} parameter See specified implementation for more info.
	 */
	public constructor(arg: string | RegExp | MatcherFunction<string | undefined>,
						  parameterOrCaseSensitive?: string | boolean,
						  parameter?: string);
	
	/**
	 * Initializes a new SimpleStringAbstractRouter instance that uses the provided content to match against the return
	 * value of {@link #supply}, with optional parameterization.
	 *
	 * @param {string | RegExp | MatcherFunction<string | undefined>} arg See specified implementation for more info.
	 * @param {string | boolean | undefined} parameterOrCaseSensitive See specified implementation for more info.
	 * @param {string | undefined} parameter See specified implementation for more info.
	 */
	public constructor(arg: string | RegExp | MatcherFunction<string | undefined>,
						  parameterOrCaseSensitive?: string | boolean,
						  parameter?: string) {
		
		let matcher: MatcherFunction<string | undefined>;
		
		if (typeof arg === "string") {
			
			if (parameterOrCaseSensitive ?? true) {
				
				matcher = (content: string | undefined): boolean => content === arg;
				
			} else {
				
				matcher = (content: string | undefined): boolean => {
					
					if (content === undefined) return arg === undefined;
					else if (arg === undefined) return false;
					else return content.toLowerCase() === arg.toLowerCase();
					
				}
				
			}
			
			super(matcher, parameter);
			
		} else {
			
			if (typeof arg === "object") {
				
				matcher = (content: string | undefined): boolean => {
					
					return (content === undefined ? false : arg.test(content));
					
				}
				
			} else matcher = arg;
			
			super(matcher, parameterOrCaseSensitive as string | undefined);
			
		}
		
	}
	
}
