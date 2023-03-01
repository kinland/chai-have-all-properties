import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import dirtyChai from 'dirty-chai';

// This forces chai statement assertions such as expect(...).to.be.true to use function format expect(...).to.be.true()
chai.use(dirtyChai);

describe('Boilerplate test stub group', () => {
    it('Boilerplate test stub', () => {
    });
});
