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

/**
 * ### .ownPropertyDescriptor(name[, descriptor[, msg]])
 *
 * Asserts that the target has its own property descriptor with the given key
 * `name`. Enumerable and non-enumerable properties are included in the
 * search.
 *
 *     expect({a: 1}).to.have.ownPropertyDescriptor('a');
 *
 * When `descriptor` is provided, `.ownPropertyDescriptor` also asserts that
 * the property's descriptor is deeply equal to the given `descriptor`. See
 * the `deep-eql` project page for info on the deep equality algorithm:
 * https://github.com/chaijs/deep-eql.
 *
 *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
 *       configurable: true,
 *       enumerable: true,
 *       writable: true,
 *       value: 1,
 *     });
 *
 * Add `.not` earlier in the chain to negate `.ownPropertyDescriptor`.
 *
 *     expect({a: 1}).to.not.have.ownPropertyDescriptor('b');
 *
 * However, it's dangerous to negate `.ownPropertyDescriptor` when providing
 * a `descriptor`. The problem is that it creates uncertain expectations by
 * asserting that the target either doesn't have a property descriptor with
 * the given key `name`, or that it does have a property descriptor with the
 * given key `name` but it’s not deeply equal to the given `descriptor`. It's
 * often best to identify the exact output that's expected, and then write an
 * assertion that only accepts that exact output.
 *
 * When the target isn't expected to have a property descriptor with the given
 * key `name`, it's often best to assert exactly that.
 *
 *     // Recommended
 *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a');
 *
 *     // Not recommended
 *     expect({b: 2}).to.not.have.ownPropertyDescriptor('a', {
 *       configurable: true,
 *       enumerable: true,
 *       writable: true,
 *       value: 1,
 *     });
 *
 * When the target is expected to have a property descriptor with the given
 * key `name`, it's often best to assert that the property has its expected
 * descriptor, rather than asserting that it doesn't have one of many
 * unexpected descriptors.
 *
 *     // Recommended
 *     expect({a: 3}).to.have.ownPropertyDescriptor('a', {
 *       configurable: true,
 *       enumerable: true,
 *       writable: true,
 *       value: 3,
 *     });
 *
 *     // Not recommended
 *     expect({a: 3}).to.not.have.ownPropertyDescriptor('a', {
 *       configurable: true,
 *       enumerable: true,
 *       writable: true,
 *       value: 1,
 *     });
 *
 * `.ownPropertyDescriptor` changes the target of any assertions that follow
 * in the chain to be the value of the property descriptor from the original
 * target object.
 *
 *     expect({a: 1}).to.have.ownPropertyDescriptor('a')
 *       .that.has.property('enumerable', true);
 *
 * `.ownPropertyDescriptor` accepts an optional `msg` argument which is a
 * custom error message to show when the assertion fails. The message can also
 * be given as the second argument to `expect`. When not providing
 * `descriptor`, only use the second form.
 *
 *     // Recommended
 *     expect({a: 1}).to.have.ownPropertyDescriptor('a', {
 *       configurable: true,
 *       enumerable: true,
 *       writable: true,
 *       value: 2,
 *     }, 'nooo why fail??');
 *
 *     // Recommended
 *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('a', {
 *       configurable: true,
 *       enumerable: true,
 *       writable: true,
 *       value: 2,
 *     });
 *
 *     // Recommended
 *     expect({a: 1}, 'nooo why fail??').to.have.ownPropertyDescriptor('b');
 *
 *     // Not recommended
 *     expect({a: 1})
 *       .to.have.ownPropertyDescriptor('b', undefined, 'nooo why fail??');
 *
 * The above assertion isn't the same thing as not providing `descriptor`.
 * Instead, it's asserting that the target object has a `b` property
 * descriptor that's deeply equal to `undefined`.
 *
 * The alias `.haveOwnPropertyDescriptor` can be used interchangeably with
 * `.ownPropertyDescriptor`.
 *
 * @name ownPropertyDescriptor
 * @alias haveOwnPropertyDescriptor
 * @param {String} name
 * @param {Object} descriptor _optional_
 * @param {String} msg _optional_
 * @namespace BDD
 * @api public
 */

function assertOwnPropertyDescriptor(name, descriptor, msg) {
  if (typeof descriptor === 'string') {
    msg = descriptor;
    descriptor = null;
  }
  if (msg) flag(this, 'message', msg);
  var obj = flag(this, 'object');
  var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
  if (actualDescriptor && descriptor) {
    this.assert(
      _.eql(descriptor, actualDescriptor)
      , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor)
      , 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor)
      , descriptor
      , actualDescriptor
      , true
    );
  } else {
    this.assert(
      actualDescriptor
      , 'expected #{this} to have an own property descriptor for ' + _.inspect(name)
      , 'expected #{this} to not have an own property descriptor for ' + _.inspect(name)
    );
  }
  flag(this, 'object', actualDescriptor);
}

Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);

/**
 * ### .lengthOf(n[, msg])
 *
 * Asserts that the target's `length` or `size` is equal to the given number
 * `n`.
 *
 *     expect([1, 2, 3]).to.have.lengthOf(3);
 *     expect('foo').to.have.lengthOf(3);
 *     expect(new Set([1, 2, 3])).to.have.lengthOf(3);
 *     expect(new Map([['a', 1], ['b', 2], ['c', 3]])).to.have.lengthOf(3);
 *
 * Add `.not` earlier in the chain to negate `.lengthOf`. However, it's often
 * best to assert that the target's `length` property is equal to its expected
 * value, rather than not equal to one of many unexpected values.
 *
 *     expect('foo').to.have.lengthOf(3); // Recommended
 *     expect('foo').to.not.have.lengthOf(4); // Not recommended
 *
 * `.lengthOf` accepts an optional `msg` argument which is a custom error
 * message to show when the assertion fails. The message can also be given as
 * the second argument to `expect`.
 *
 *     expect([1, 2, 3]).to.have.lengthOf(2, 'nooo why fail??');
 *     expect([1, 2, 3], 'nooo why fail??').to.have.lengthOf(2);
 *
 * `.lengthOf` can also be used as a language chain, causing all `.above`,
 * `.below`, `.least`, `.most`, and `.within` assertions that follow in the
 * chain to use the target's `length` property as the target. However, it's
 * often best to assert that the target's `length` property is equal to its
 * expected length, rather than asserting that its `length` property falls
 * within some range of values.
 *
 *     // Recommended
 *     expect([1, 2, 3]).to.have.lengthOf(3);
 *
 *     // Not recommended
 *     expect([1, 2, 3]).to.have.lengthOf.above(2);
 *     expect([1, 2, 3]).to.have.lengthOf.below(4);
 *     expect([1, 2, 3]).to.have.lengthOf.at.least(3);
 *     expect([1, 2, 3]).to.have.lengthOf.at.most(3);
 *     expect([1, 2, 3]).to.have.lengthOf.within(2,4);
 *
 * Due to a compatibility issue, the alias `.length` can't be chained directly
 * off of an uninvoked method such as `.a`. Therefore, `.length` can't be used
 * interchangeably with `.lengthOf` in every situation. It's recommended to
 * always use `.lengthOf` instead of `.length`.
 *
 *     expect([1, 2, 3]).to.have.a.length(3); // incompatible; throws error
 *     expect([1, 2, 3]).to.have.a.lengthOf(3);  // passes as expected
 *
 * @name lengthOf
 * @alias length
 * @param {Number} n
 * @param {String} msg _optional_
 * @namespace BDD
 * @api public
 */

function assertLengthChain() {
  flag(this, 'doLength', true);
}

function assertLength(n, msg) {
  if (msg) flag(this, 'message', msg);
  var obj = flag(this, 'object')
    , objType = _.type(obj).toLowerCase()
    , flagMsg = flag(this, 'message')
    , ssfi = flag(this, 'ssfi')
    , descriptor = 'length'
    , itemsCount;

  switch (objType) {
    case 'map':
    case 'set':
      descriptor = 'size';
      itemsCount = obj.size;
      break;
    default:
      new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
      itemsCount = obj.length;
  }

  this.assert(
    itemsCount == n
    , 'expected #{this} to have a ' + descriptor + ' of #{exp} but got #{act}'
    , 'expected #{this} to not have a ' + descriptor + ' of #{act}'
    , n
    , itemsCount
  );
}

Assertion.addChainableMethod('length', assertLength, assertLengthChain);
Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);

/**
 * ### .match(re[, msg])
 *
 * Asserts that the target matches the given regular expression `re`.
 *
 *     expect('foobar').to.match(/^foo/);
 *
 * Add `.not` earlier in the chain to negate `.match`.
 *
 *     expect('foobar').to.not.match(/taco/);
 *
 * `.match` accepts an optional `msg` argument which is a custom error message
 * to show when the assertion fails. The message can also be given as the
 * second argument to `expect`.
 *
 *     expect('foobar').to.match(/taco/, 'nooo why fail??');
 *     expect('foobar', 'nooo why fail??').to.match(/taco/);
 *
 * The alias `.matches` can be used interchangeably with `.match`.
 *
 * @name match
 * @alias matches
 * @param {RegExp} re
 * @param {String} msg _optional_
 * @namespace BDD
 * @api public
 */
function assertMatch(re, msg) {
  if (msg) flag(this, 'message', msg);
  var obj = flag(this, 'object');
  this.assert(
    re.exec(obj)
    , 'expected #{this} to match ' + re
    , 'expected #{this} not to match ' + re
  );
}

Assertion.addMethod('match', assertMatch);
Assertion.addMethod('matches', assertMatch);


/**
 * ### .keys(key1[, key2[, ...]])
 *
 * Asserts that the target object, array, map, or set has the given keys. Only
 * the target's own inherited properties are included in the search.
 *
 * When the target is an object or array, keys can be provided as one or more
 * string arguments, a single array argument, or a single object argument. In
 * the latter case, only the keys in the given object matter; the values are
 * ignored.
 *
 *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
 *     expect(['x', 'y']).to.have.all.keys(0, 1);
 *
 *     expect({a: 1, b: 2}).to.have.all.keys(['a', 'b']);
 *     expect(['x', 'y']).to.have.all.keys([0, 1]);
 *
 *     expect({a: 1, b: 2}).to.have.all.keys({a: 4, b: 5}); // ignore 4 and 5
 *     expect(['x', 'y']).to.have.all.keys({0: 4, 1: 5}); // ignore 4 and 5
 *
 * When the target is a map or set, each key must be provided as a separate
 * argument.
 *
 *     expect(new Map([['a', 1], ['b', 2]])).to.have.all.keys('a', 'b');
 *     expect(new Set(['a', 'b'])).to.have.all.keys('a', 'b');
 *
 * Because `.keys` does different things based on the target's type, it's
 * important to check the target's type before using `.keys`. See the `.a` doc
 * for info on testing a target's type.
 *
 *     expect({a: 1, b: 2}).to.be.an('object').that.has.all.keys('a', 'b');
 *
 * By default, strict (`===`) equality is used to compare keys of maps and
 * sets. Add `.deep` earlier in the chain to use deep equality instead. See
 * the `deep-eql` project page for info on the deep equality algorithm:
 * https://github.com/chaijs/deep-eql.
 *
 *     // Target set deeply (but not strictly) has key `{a: 1}`
 *     expect(new Set([{a: 1}])).to.have.all.deep.keys([{a: 1}]);
 *     expect(new Set([{a: 1}])).to.not.have.all.keys([{a: 1}]);
 *
 * By default, the target must have all of the given keys and no more. Add
 * `.any` earlier in the chain to only require that the target have at least
 * one of the given keys. Also, add `.not` earlier in the chain to negate
 * `.keys`. It's often best to add `.any` when negating `.keys`, and to use
 * `.all` when asserting `.keys` without negation.
 *
 * When negating `.keys`, `.any` is preferred because `.not.any.keys` asserts
 * exactly what's expected of the output, whereas `.not.all.keys` creates
 * uncertain expectations.
 *
 *     // Recommended; asserts that target doesn't have any of the given keys
 *     expect({a: 1, b: 2}).to.not.have.any.keys('c', 'd');
 *
 *     // Not recommended; asserts that target doesn't have all of the given
 *     // keys but may or may not have some of them
 *     expect({a: 1, b: 2}).to.not.have.all.keys('c', 'd');
 *
 * When asserting `.keys` without negation, `.all` is preferred because
 * `.all.keys` asserts exactly what's expected of the output, whereas
 * `.any.keys` creates uncertain expectations.
 *
 *     // Recommended; asserts that target has all the given keys
 *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b');
 *
 *     // Not recommended; asserts that target has at least one of the given
 *     // keys but may or may not have more of them
 *     expect({a: 1, b: 2}).to.have.any.keys('a', 'b');
 *
 * Note that `.all` is used by default when neither `.all` nor `.any` appear
 * earlier in the chain. However, it's often best to add `.all` anyway because
 * it improves readability.
 *
 *     // Both assertions are identical
 *     expect({a: 1, b: 2}).to.have.all.keys('a', 'b'); // Recommended
 *     expect({a: 1, b: 2}).to.have.keys('a', 'b'); // Not recommended
 *
 * Add `.include` earlier in the chain to require that the target's keys be a
 * superset of the expected keys, rather than identical sets.
 *
 *     // Target object's keys are a superset of ['a', 'b'] but not identical
 *     expect({a: 1, b: 2, c: 3}).to.include.all.keys('a', 'b');
 *     expect({a: 1, b: 2, c: 3}).to.not.have.all.keys('a', 'b');
 *
 * However, if `.any` and `.include` are combined, only the `.any` takes
 * effect. The `.include` is ignored in this case.
 *
 *     // Both assertions are identical
 *     expect({a: 1}).to.have.any.keys('a', 'b');
 *     expect({a: 1}).to.include.any.keys('a', 'b');
 *
 * A custom error message can be given as the second argument to `expect`.
 *
 *     expect({a: 1}, 'nooo why fail??').to.have.key('b');
 *
 * The alias `.key` can be used interchangeably with `.keys`.
 *
 * @name keys
 * @alias key
 * @param {...String|Array|Object} keys
 * @namespace BDD
 * @api public
 */

function assertKeys(keys) {
  var obj = flag(this, 'object')
    , objType = _.type(obj)
    , keysType = _.type(keys)
    , ssfi = flag(this, 'ssfi')
    , isDeep = flag(this, 'deep')
    , str
    , deepStr = ''
    , actual
    , ok = true
    , flagMsg = flag(this, 'message');

  flagMsg = flagMsg ? flagMsg + ': ' : '';
  var mixedArgsMsg = flagMsg + 'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';

  if (objType === 'Map' || objType === 'Set') {
    deepStr = isDeep ? 'deeply ' : '';
    actual = [];

    // Map and Set '.keys' aren't supported in IE 11. Therefore, use .forEach.
    obj.forEach(function (val, key) { actual.push(key) });

    if (keysType !== 'Array') {
      keys = Array.prototype.slice.call(arguments);
    }
  } else {
    actual = _.getOwnEnumerableProperties(obj);

    switch (keysType) {
      case 'Array':
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, undefined, ssfi);
        }
        break;
      case 'Object':
        if (arguments.length > 1) {
          throw new AssertionError(mixedArgsMsg, undefined, ssfi);
        }
        keys = Object.keys(keys);
        break;
      default:
        keys = Array.prototype.slice.call(arguments);
    }

    // Only stringify non-Symbols because Symbols would become "Symbol()"
    keys = keys.map(function (val) {
      return typeof val === 'symbol' ? val : String(val);
    });
  }

  if (!keys.length) {
    throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
  }

  var len = keys.length
    , any = flag(this, 'any')
    , all = flag(this, 'all')
    , expected = keys;

  if (!any && !all) {
    all = true;
  }

  // Has any
  if (any) {
    ok = expected.some(function (expectedKey) {
      return actual.some(function (actualKey) {
        if (isDeep) {
          return _.eql(expectedKey, actualKey);
        } else {
          return expectedKey === actualKey;
        }
      });
    });
  }

  // Has all
  if (all) {
    ok = expected.every(function (expectedKey) {
      return actual.some(function (actualKey) {
        if (isDeep) {
          return _.eql(expectedKey, actualKey);
        } else {
          return expectedKey === actualKey;
        }
      });
    });

    if (!flag(this, 'contains')) {
      ok = ok && keys.length == actual.length;
    }
  }

  // Key string
  if (len > 1) {
    keys = keys.map(function (key) {
      return _.inspect(key);
    });
    var last = keys.pop();
    if (all) {
      str = keys.join(', ') + ', and ' + last;
    }
    if (any) {
      str = keys.join(', ') + ', or ' + last;
    }
  } else {
    str = _.inspect(keys[0]);
  }

  // Form
  str = (len > 1 ? 'keys ' : 'key ') + str;

  // Have / include
  str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;

  // Assertion
  this.assert(
    ok
    , 'expected #{this} to ' + deepStr + str
    , 'expected #{this} to not ' + deepStr + str
    , expected.slice(0).sort(_.compareByInspect)
    , actual.sort(_.compareByInspect)
    , true
  );
}

Assertion.addMethod('keys', assertKeys);
Assertion.addMethod('key', assertKeys);
