import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import { describe, it } from 'mocha';

import { haveAllPropertiesPlugin } from '../lib/propertiesAssertion';

// This forces chai statement assertions such as expect(...).to.be.true to use function format expect(...).to.be.true()
chai.use(dirtyChai);
// This adds our new .properties assertions to Chai
chai.use(haveAllPropertiesPlugin);

const testData = {
    onePropertyObject: {
        a: 5,
    },
    twoPropertiesObject: {
        a: 5,
        b: 10,
    },
    threePropertiesObject: {
        a: 5,
        b: 10,
        c: 15,
    },
};

function makeAssert<T>(object: object, properties: PropertiesListType<T>, negated?: boolean, message?: string,) {
    let builder = expect(object).to;
    if (negated) {
        builder = builder.not;
    }
    builder.have.properties(properties, message);
}

describe('Test chai-have-all-properties', () => {
    it('assert 1/1 property present', () => {
        makeAssert(testData.onePropertyObject, ['a']);
    });

    it('assert 1/1 property missing', () => {
        expect(
            makeAssert.bind(this, testData.onePropertyObject, ['bar'])
        ).to.throw();
    });

    it('assert not 1/1 property present', () => {
        expect(
            makeAssert.bind(this, testData.onePropertyObject, ['a'], true)
        ).to.throw();
    });

    it('assert not 1/1 property missing', () => {
        // expect(testData.onePropertyObject).to.not.have.properties(['bar'])
        makeAssert(testData.onePropertyObject, ['bar'], true);
    });
});
