import Promise from 'bluebird';
import sinon from 'sinon';
import { expect } from 'chai';

import endpointGenerator from '../src/endpointGenerator';

function rand() {
  return Math.random().toString(36).substring(7);
}

describe('endpointGenerator', () => {

  describe('generate', () => {

    it('should allow chaining single child', (done) => {
      const baseIn = rand();
      const childIn = rand();
      const baseReturn = rand();
      const childReturn = rand();

      let baseCount = 0;
      let childCount = 0;

      function base(inputValue) {
        expect(inputValue).to.equal(baseIn);
        baseCount++;
        return baseReturn;
      }

      function child(inputValue) {
        expect(inputValue).to.equal(childIn);
        childCount++;
        return childReturn;
      }

      const base = endpointGenerator.generate(base, [child]);

      return Promise.try(base, [baseIn])
        .then((baseValue) => {
          expect(baseValue).to.equal(baseReturn);

          return base(baseIn).child(childIn)
        })
        .then((childValue) => {
          expect(childValue).to.equal(childReturn);
        })
        .then(() => {
          expect(baseCount).to.equal(1);
          expect(childCount).to.equal(1);
          done();
        })
        .catch(done);

    });

  });

});
