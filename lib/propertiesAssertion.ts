/*
 * This plugin creates a new .properties method for Chai, which allows you to group many .property() calls together.
 * As much as possible, behavior from Chai's .properties() was mimicked to make usage intuitive.
 *
 * As such, this file was originally adapted from https://github.com/chaijs/chai at tag v.5.0.0-alpha.0 (b8a4285)
 * To clearly distinguish between code I wrote and code that came from Chai's repo and preserve authorship,
 * the original version of this file was created using Chai's repo and running the following:
 *     `git-filter-repo --path "lib/chai/core/assertions.js"`
 * 
 * Copyright(c) 2023 dyhork <16787581+dyhork@users.noreply.github.com>
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

import { AssertionError } from 'chai';
import deepEqual from 'deep-eql';

import type { ChaiAssertion, ChaiStatic, ChaiUtils, PropertyNameType } from './types';

// Chai Assertions are non Error objects 
/* eslint @typescript-eslint/no-throw-literal: "off" */

function isRecord<T>(data: PropertiesListType<T>): data is Record<PropertyNameType, T> {
    return typeof data === 'object' && 'key' in data;
}

function hasAtLeastNProperties(_chai: ChaiStatic, utils: ChaiUtils): void {

}

function hasAtMostNProperties(_chai: ChaiStatic, utils: ChaiUtils): void {

}

function initHaveAllPropertiesPlugin(_chai: ChaiStatic, utils: ChaiUtils): void {
    _chai.Assertion.addMethod('properties', hasAllProperties);

    _chai.Assertion.addMethod('allProperties', hasAllProperties);

    // expect(?).to.have.at.least(n).properties(?)
    // _chai.Assertion.addMethod('atLeastNProperties', hasAtLeastNProperties);

    // expect(?).to.have.at.most(n).properties(?)
    // _chai.Assertion.addMethod('atMostProperties', hasAtLeastNProperties);

    function getNameTypes<T>(properties: PropertiesListType<T>) {
        const propertyNames = isRecord(properties)
            ? Object.keys(properties)
            : properties;

        const propertyNameTypeSet = new Set<string>(
            propertyNames.map(name => typeof name)
        );
        return Array.from(propertyNameTypeSet);
    }

    /**
     * ### .properties([properties]|{properties:values}, message]])
     *
     * Asserts that the target has all properties with the given keys in `properties` array / dictionary.
     *
     *     expect({a: 1}).to.have.properties(['a']);
     *
     * When properties is a dictionary, `.properties` also asserts that all the property's value
     * is equal to the dictionary value.
     *
     *     expect({a: 1}).to.have.properties({'a': 1});
     *
     * By default, strict (`===`) equality is used. Add `.deep` earlier in the
     * chain to use deep equality instead. See the `deep-eql` project page for
     * info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
     *
     *     // Target object deeply (but not strictly) has property `x: {a: 1}`
     *     expect({x: {a: 1}}).to.have.deep.properties({'x': {a: 1} });
     *     expect({x: {a: 1}}).to.not.have.properties({'x', {a: 1} });
     *
     * The target's enumerable and non-enumerable properties are always included
     * in the search. By default, both own and inherited properties are included.
     * Add `.own` earlier in the chain to exclude inherited properties from the
     * search.
     *
     *     Object.prototype.b = 2;
     *
     *     expect({a: 1}).to.have.own.properties(['a']);
     *     expect({a: 1}).to.have.own.properties({'a': 1});
     *     expect({a: 1}).to.have.properties(['b']);
     *     expect({a: 1}).to.not.have.own.properties(['b']);
     *
     * `.deep` and `.own` can be combined.
     *
     *     expect({x: {a: 1}}).to.have.deep.own.properties({'x': {a: 1} });
     *
     * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
     * referencing nested properties.
     *
     *     expect({a: {b: ['x', 'y']}}).to.have.nested.properties(['a.b[1]']);
     *     expect({a: {b: ['x', 'y']}}).to.have.nested.properties({'a.b[1]': 'y'});
     *
     * If `.` or `[]` are part of an actual property name, they can be escaped by
     * adding two backslashes before them.
     *
     *     expect({'.a': {'[b]': 'x'}}).to.have.nested.properties(['\\.a.\\[b\\]']);
     *
     * `.deep` and `.nested` can be combined.
     *
     *     expect({a: {b: [{c: 3}]}})
     *       .to.have.deep.nested.properties({'a.b[0]': {c: 3} });
     *
     * `.own` and `.nested` cannot be combined.
     *
     * Add `.not` earlier in the chain to negate `.properties`.
     *
     *     expect({a: 1}).to.not.have.properties(['b']);
     *
     * However, it's dangerous to negate `.properties` when providing a dictionary.
     * The problem is that it creates uncertain expectations by asserting that the
     * target either doesn't have a properties with the given keys, or that it
     * does have properties with the given keys but its value isn't equal to
     * the given `value`. It's often best to identify the exact output that's
     * expected, and then write an assertion that only accepts that exact output.
     *
     * When the target isn't expected to have properties with the given keys,
     * it's often best to assert exactly that.
     *
     *     expect({b: 2}).to.not.have.properties(['a']); // Recommended
     *     expect({b: 2}).to.not.have.properties({'a': 1}); // Not recommended
     *
     * When the target is expected to have properties with the given keys,
     * it's often best to assert that the properties have their expected value, rather
     * than asserting that it doesn't have one of many unexpected values.
     *
     *     expect({a: 3}).to.have.properties({'a': 3}); // Recommended
     *     expect({a: 3}).to.not.have.properties({'a': 1}); // Not recommended
     *
     * `.properties` changes the target of any assertions that follow in the chain
     * to be the value of the properties from the original target object.
     *
     *     expect({a: 1}).to.have.properties(['a']).that.are.a('number');
     *
     * `.properties` accepts an optional `message` argument which is a custom error
     * message to show when the assertion fails. The message can also be given as
     * the second argument to `expect`. When not providing a dictionary, only use the
     * second form.
     *
     *     // Recommended
     *     expect({a: 1}).to.have.properties({'a': 2}, 'nooo why fail??');
     *     expect({a: 1}, 'nooo why fail??').to.have.properties({'a': 2});
     *     expect({a: 1}, 'nooo why fail??').to.have.properties(['b']);
     *
     *     // Not recommended
     *     expect({a: 1}).to.have.properties({'b': undefined}, 'nooo why fail??');
     *
     * The above assertion isn't the same thing as not providing `val`. Instead,
     * it's asserting that the target object has a `b` property that's equal to
     * `undefined`.
     *
     * The assertions `.ownProperties` and `.haveOwnProperties` can be used
     * interchangeably with `.own.properties`.
     *
     * @name properties
     * @param {String} name
     * @param {Mixed} val (optional)
     * @param {String} msg _optional_
     * @returns value of property for chaining
     * @namespace BDD
     * @api public
     */
    function hasAllProperties<T>(this: ChaiAssertion, properties: PropertiesListType<T>, message?: string): void {
        const flag = utils.flag;

        if (message) {
            flag(this, 'message', message);
        }

        const isNested = !!flag(this, 'nested')
            , isOwn = !!flag(this, 'own')
            , obj = flag(this, 'object') as object
            , ssfi = flag(this, 'ssfi');
        let flagMessage = flag(this, 'message') as string | undefined;

        flagMessage = flagMessage ? flagMessage + ': ' : '';

        const nameTypes = getNameTypes(properties);

        if (isNested) {
            if (nameTypes.some(nameType => nameType !== 'string')) {
                throw new AssertionError(
                    flagMessage + 'the arguments to properties must all be strings when using nested syntax',
                    undefined,
                    ssfi
                );
            }
            if (isOwn) {
                throw new AssertionError(
                    flagMessage + 'The "nested" and "own" flags cannot be combined.',
                    undefined,
                    ssfi
                );
            }
        } else if (nameTypes.some(nameType => !['string', 'number', 'symbol'].includes(nameType))) {
            throw new AssertionError(
                flagMessage + 'the argument to properties must all be strings, numbers, or symbols',
                undefined,
                ssfi
            );
        } else if (obj === null || obj === undefined) {
            throw new AssertionError(
                flagMessage + 'Target cannot be null or undefined.',
                undefined,
                ssfi
            );
        }

        const isDeep = !!flag(this, 'deep')
            , isNegated = !!flag(this, 'negate');


        const doValueCheck = isRecord(properties);

        let descriptor = '';
        if (isDeep) {
            descriptor += 'deep ';
        }
        if (isOwn) {
            descriptor += 'own ';
        }
        if (isNested) {
            descriptor += 'nested ';
        }
        descriptor += !doValueCheck ? 'properties' : 'properties/values';

        const foundProperties: PropertyNameType[] = [];
        const missingProperties: PropertyNameType[] = [];
        const valueMismatchedProperties: Record<PropertyNameType, unknown> = {};

        function addPropertyToAppropriateList(propertyName: PropertyNameType, expectedValue?: T) {
            const pathInfo = utils.getPathInfo(obj, propertyName);

            let hasProperty;
            if (isOwn) {
                hasProperty = Object.prototype.hasOwnProperty.call(obj, propertyName);
            } else if (isNested) {
                hasProperty = pathInfo.exists;
            } else {
                hasProperty = utils.hasProperty(obj, propertyName);
            }

            if (hasProperty) {
                if (expectedValue === undefined) {
                    foundProperties.push(propertyName);
                } else {
                    const value: unknown = isNested
                        ? pathInfo.value
                        : (obj as Record<PropertyNameType, unknown>)[propertyName];

                    if (isDeep ? deepEqual(expectedValue, value) : expectedValue === value) {
                        foundProperties.push(propertyName);
                    } else {
                        valueMismatchedProperties[propertyName] = value;
                    }
                }
            } else {
                missingProperties.push(propertyName);
            }
        }

        if (doValueCheck) {
            // we are checking not just the presence of properties, but their values
            for (const [propertyName, expectedValue] of Object.entries(properties)) {
                addPropertyToAppropriateList(propertyName, expectedValue);
            }
        } else {
            // we are only checking whether properties exist
            for (const propertyName of properties) {
                addPropertyToAppropriateList(propertyName);
            }
        }

        const numberMismatchedValues = Object.keys(valueMismatchedProperties).length;
        let assertionPassed = false;

        // figuring out the correct message is unfortunately fairly complex.
        // Precalculating the string to avoid needing nested ternaries
        // or inner lambda function.
        let assertMessage;
        if (!isNegated) {
            if (missingProperties.length === 0 && numberMismatchedValues === 0) {
                assertMessage = `${obj} had all expected ${descriptor}: [${properties}]`;
                assertionPassed = true;
            } else if (foundProperties.length === 0 && numberMismatchedValues === 0) {
                assertMessage = `${obj} was missing all expected ${descriptor}: [${missingProperties}]`;
            } else {
                // one or more properties were missing and/or didn't have the expected value
                assertMessage = `${obj} was missing expected ${descriptor}: [${missingProperties}]`;
                if (numberMismatchedValues > 0) {
                    assertMessage += ` and these ${descriptor} did not match expected values: [${valueMismatchedProperties}]`;
                }
                if (foundProperties.length > 0) {
                    assertMessage += ` but did have some matching expected ${descriptor}: [${foundProperties}]`;
                }
            }
        } else {
            // foundProperties is a list of forbidden properties that matched
            // Object.keys(valueMismatchedProperties) is a list of found properties that didn't match forbidden values
            // missingProperties is a list of forbidden properties that were not matched
            if (foundProperties.length === 0) {
                assertMessage = `${obj} did not have any forbidden ${descriptor}.`;
                assertionPassed = true;
            } else {
                if (!doValueCheck) {
                    assertMessage = `${obj} had forbidden ${descriptor}: [${foundProperties}]`;
                } else {
                    const matchedForbiddenValues = Object.fromEntries(
                        Object.entries(properties)
                            .filter(([propertyName, propertyValue]) => foundProperties.includes(propertyName))
                    );
                    assertMessage = `${obj} had forbidden ${descriptor}: [${matchedForbiddenValues}]`;
                }
            }
        }

        this.assert(
            // 'assertionPassed' will be positive when we want this assertion to pass (due to the above logic).
            // So if we're using .not, we need to flip it to match Chai's expectation.
            !isNegated ? assertionPassed : !assertionPassed,
            assertMessage,
            assertMessage,
            !isNegated ? properties : `None of: ${properties}`,
            obj
        );
    }
}

export { initHaveAllPropertiesPlugin as haveAllPropertiesPlugin };
