/*!
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

import AssertionError from 'assertion-error';

/**
 * ### .property(name[, val[, msg]])
 *
 * Asserts that the target has a property with the given key `name`.
 *
 *     expect({a: 1}).to.have.property('a');
 *
 * When `val` is provided, `.property` also asserts that the property's value
 * is equal to the given `val`.
 *
 *     expect({a: 1}).to.have.property('a', 1);
 *
 * By default, strict (`===`) equality is used. Add `.deep` earlier in the
 * chain to use deep equality instead. See the `deep-eql` project page for
 * info on the deep equality algorithm: https://github.com/chaijs/deep-eql.
 *
 *     // Target object deeply (but not strictly) has property `x: {a: 1}`
 *     expect({x: {a: 1}}).to.have.deep.property('x', {a: 1});
 *     expect({x: {a: 1}}).to.not.have.property('x', {a: 1});
 *
 * The target's enumerable and non-enumerable properties are always included
 * in the search. By default, both own and inherited properties are included.
 * Add `.own` earlier in the chain to exclude inherited properties from the
 * search.
 *
 *     Object.prototype.b = 2;
 *
 *     expect({a: 1}).to.have.own.property('a');
 *     expect({a: 1}).to.have.own.property('a', 1);
 *     expect({a: 1}).to.have.property('b');
 *     expect({a: 1}).to.not.have.own.property('b');
 *
 * `.deep` and `.own` can be combined.
 *
 *     expect({x: {a: 1}}).to.have.deep.own.property('x', {a: 1});
 *
 * Add `.nested` earlier in the chain to enable dot- and bracket-notation when
 * referencing nested properties.
 *
 *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]');
 *     expect({a: {b: ['x', 'y']}}).to.have.nested.property('a.b[1]', 'y');
 *
 * If `.` or `[]` are part of an actual property name, they can be escaped by
 * adding two backslashes before them.
 *
 *     expect({'.a': {'[b]': 'x'}}).to.have.nested.property('\\.a.\\[b\\]');
 *
 * `.deep` and `.nested` can be combined.
 *
 *     expect({a: {b: [{c: 3}]}})
 *       .to.have.deep.nested.property('a.b[0]', {c: 3});
 *
 * `.own` and `.nested` cannot be combined.
 *
 * Add `.not` earlier in the chain to negate `.property`.
 *
 *     expect({a: 1}).to.not.have.property('b');
 *
 * However, it's dangerous to negate `.property` when providing `val`. The
 * problem is that it creates uncertain expectations by asserting that the
 * target either doesn't have a property with the given key `name`, or that it
 * does have a property with the given key `name` but its value isn't equal to
 * the given `val`. It's often best to identify the exact output that's
 * expected, and then write an assertion that only accepts that exact output.
 *
 * When the target isn't expected to have a property with the given key
 * `name`, it's often best to assert exactly that.
 *
 *     expect({b: 2}).to.not.have.property('a'); // Recommended
 *     expect({b: 2}).to.not.have.property('a', 1); // Not recommended
 *
 * When the target is expected to have a property with the given key `name`,
 * it's often best to assert that the property has its expected value, rather
 * than asserting that it doesn't have one of many unexpected values.
 *
 *     expect({a: 3}).to.have.property('a', 3); // Recommended
 *     expect({a: 3}).to.not.have.property('a', 1); // Not recommended
 *
 * `.property` changes the target of any assertions that follow in the chain
 * to be the value of the property from the original target object.
 *
 *     expect({a: 1}).to.have.property('a').that.is.a('number');
 *
 * `.property` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`. When not providing `val`, only use the
 * second form.
 *
 *     // Recommended
 *     expect({a: 1}).to.have.property('a', 2, 'nooo why fail??');
 *     expect({a: 1}, 'nooo why fail??').to.have.property('a', 2);
 *     expect({a: 1}, 'nooo why fail??').to.have.property('b');
 *
 *     // Not recommended
 *     expect({a: 1}).to.have.property('b', undefined, 'nooo why fail??');
 *
 * The above assertion isn't the same thing as not providing `val`. Instead,
 * it's asserting that the target object has a `b` property that's equal to
 * `undefined`.
 *
 * The assertions `.ownProperty` and `.haveOwnProperty` can be used
 * interchangeably with `.own.property`.
 *
 * @name property
 * @param {String} name
 * @param {Mixed} val (optional)
 * @param {String} msg _optional_
 * @returns value of property for chaining
 * @namespace BDD
 * @api public
 */

function assertProperty(name, val, msg) {
    if (msg) flag(this, 'message', msg);

    var isNested = flag(this, 'nested')
        , isOwn = flag(this, 'own')
        , flagMsg = flag(this, 'message')
        , obj = flag(this, 'object')
        , ssfi = flag(this, 'ssfi')
        , nameType = typeof name;

    flagMsg = flagMsg ? flagMsg + ': ' : '';

    if (isNested) {
        if (nameType !== 'string') {
            throw new AssertionError(
                flagMsg + 'the argument to property must be a string when using nested syntax',
                undefined,
                ssfi
            );
        }
    } else {
        if (nameType !== 'string' && nameType !== 'number' && nameType !== 'symbol') {
            throw new AssertionError(
                flagMsg + 'the argument to property must be a string, number, or symbol',
                undefined,
                ssfi
            );
        }
    }

    if (isNested && isOwn) {
        throw new AssertionError(
            flagMsg + 'The "nested" and "own" flags cannot be combined.',
            undefined,
            ssfi
        );
    }

    if (obj === null || obj === undefined) {
        throw new AssertionError(
            flagMsg + 'Target cannot be null or undefined.',
            undefined,
            ssfi
        );
    }

    var isDeep = flag(this, 'deep')
        , negate = flag(this, 'negate')
        , pathInfo = isNested ? _.getPathInfo(obj, name) : null
        , value = isNested ? pathInfo.value : obj[name];

    var descriptor = '';
    if (isDeep) descriptor += 'deep ';
    if (isOwn) descriptor += 'own ';
    if (isNested) descriptor += 'nested ';
    descriptor += 'property ';

    var hasProperty;
    if (isOwn) hasProperty = Object.prototype.hasOwnProperty.call(obj, name);
    else if (isNested) hasProperty = pathInfo.exists;
    else hasProperty = _.hasProperty(obj, name);

    // When performing a negated assertion for both name and val, merely having
    // a property with the given name isn't enough to cause the assertion to
    // fail. It must both have a property with the given name, and the value of
    // that property must equal the given val. Therefore, skip this assertion in
    // favor of the next.
    if (!negate || arguments.length === 1) {
        this.assert(
            hasProperty
            , 'expected #{this} to have ' + descriptor + _.inspect(name)
            , 'expected #{this} to not have ' + descriptor + _.inspect(name));
    }

    if (arguments.length > 1) {
        this.assert(
            hasProperty && (isDeep ? _.eql(val, value) : val === value)
            , 'expected #{this} to have ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}'
            , 'expected #{this} to not have ' + descriptor + _.inspect(name) + ' of #{act}'
            , val
            , value
        );
    }

    flag(this, 'object', value);
}

Assertion.addMethod('property', assertProperty);

function assertOwnProperty(name, value, msg) {
    flag(this, 'own', true);
    assertProperty.apply(this, arguments);
}

Assertion.addMethod('ownProperty', assertOwnProperty);
Assertion.addMethod('haveOwnProperty', assertOwnProperty);

