type PropertyNameType = import('./types').PropertyNameType;
type PropertiesListType<T> = import('./types').PropertiesListType<T>;

declare module 'chai' {
    global {
        export namespace Chai {
            interface Assertion {
                properties<T>(properties: PropertiesListType<T>, message?: string): Promise<void>;
                atMostProperties(maxCount: number, ...expectedProperties: string[]): Promise<void>;
                atLeastProperties(minCount: number, ...expectedProperties: string[]): Promise<void>;
            }
            interface AssertionPrototype {
                /* eslint-disable @typescript-eslint/ban-types */
                assert<A, B>(
                    expr: boolean,
                    msg: String | Function,
                    negateMsg: String | Function,
                    expected: A,
                    _actual?: B,
                    showDiff?: Boolean
                ): void
                /* eslint-enable @typescript-eslint/ban-types */
            }
            interface ChaiUtils {
                // Chai's lib/chai/core/assertions.ts says propertyName can be string|number|symbol
                // but ChaiUtils.getPathInfo's signature thinks path is required to be a string
                getPathInfo(obj: object, path: PropertyNameType): PathInfo;
            }
        }
    }
}
