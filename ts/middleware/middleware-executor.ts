import { Middlewareable } from "./middleware";

export type MiddlewareRegistrationFunction = (middleware: Middlewareable) => void;

/**
 * An interface representative of a type that has/runs Middleware.
 *
 * @author Trevor Sears <trevorsears.main@gmail.com>
 * @version v0.1.0
 * @since v0.1.0
 */
export interface MiddlewareExecutor {
	
	/**
	 * Adds the specified middleware before all other middleware for this MiddlewareExecutor.
	 *
	 * @param {Middlewareable} middleware The middleware to add to this MiddlewareExecutor in the specified manner.
	 */
	addMiddlewareAtBeginning(middleware: Middlewareable): void;
	
	/**
	 * Adds the specified middleware in such a way as to run before this MiddlewareExecutor's #handler method, but
	 * after all other such middleware.
	 *
	 * @param {Middlewareable} middleware The middleware to add to this MiddlewareExecutor in the specified manner.
	 */
	addMiddlewareBeforeHandler(middleware: Middlewareable): void;
	
	/**
	 * Adds the specified middleware in such a way as to run after this MiddlewareExecutor's #handler method, but
	 * before all other such middleware.
	 *
	 * @param {Middlewareable} middleware The middleware to add to this MiddlewareExecutor in the specified manner.
	 */
	addMiddlewareAfterHandler(middleware: Middlewareable): void;
	
	/**
	 * Adds the specified middleware after all other middleware for this MiddlewareExecutor.
	 *
	 * @param {Middlewareable} middleware The middleware to add to this MiddlewareExecutor in the specified manner.
	 */
	addMiddlewareAtEnd(middleware: Middlewareable): void;
	
}
