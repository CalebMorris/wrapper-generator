import Promise from 'bluebird';
import sinon from 'sinon';
import { expect } from 'chai';

import endpointGenerator from '../src/endpointGenerator';

describe('endpointGenerator', () => {

  describe('generate', () => {

    it('should allow chaining single child', (done) => {
      let baseCount = 0;
      let childCount = 0;

      function base() {
        baseCount++;
      }

      function child() {
        childCount++;
      }

      const base = endpointGenerator.generate(base, [child]);

      return Promise.try(base)
        .then(() => {
          return base().child();
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
