import Promise from 'bluebird';
import sinon from 'sinon';
import { expect } from 'chai';

import endpointGenerator from '../src/endpoint-generator';

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
        baseCount += 1;
        return baseReturn;
      }

      function child(inputValue) {
        expect(inputValue).to.equal(childIn);
        childCount += 1;
        return childReturn;
      }

      const base = endpointGenerator.generate(base, { child });

      return Promise.try(base, [baseIn])
        .then((baseValue) => {
          expect(baseValue).to.equal(baseReturn);

          const baseOut = base(baseIn);
          expect(baseOut).to.be.an('object');
          expect(baseOut.child).to.be.a('function');

          return baseOut.child(childIn);
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

    it('should allow chaining grand child', (done) => {
      const baseIn = rand();
      const childIn = rand();
      const grandChildIn = rand();
      const baseReturn = rand();
      const childReturn = rand();
      const grandchildReturn = rand();

      let baseCount = 0;
      let childCount = 0;
      let grandchildCount = 0;

      function base(inputValue) {
        expect(inputValue).to.equal(baseIn);
        baseCount += 1;
        return baseReturn;
      }

      function child(inputValue) {
        expect(inputValue).to.equal(childIn);
        childCount += 1;
        return childReturn;
      }

      function grandchild(inputValue) {
        expect(inputValue).to.equal(grandChildIn);
        grandchildCount += 1;
        return grandchildReturn;
      }

      const child = endpointGenerator.generate(child, { grandchild});
      const base = endpointGenerator.generate(base, { child });

      return Promise.try(base, [baseIn])
        .then((baseValue) => {
          expect(baseValue).to.equal(baseReturn);

          const baseOut = base(baseIn);
          expect(baseOut).to.be.an('object');
          expect(baseOut.child).to.be.a('function');

          return baseOut.child(childIn);
        })
        .then((childValue) => {
          expect(childValue).to.equal(childReturn);

          return base(baseIn).child(childIn).grandchild(grandChildIn);
        })
        .then((grandChildValue) => {
          expect(grandChildValue).to.equal(grandchildReturn);
        })
        .then(() => {
          expect(baseCount).to.equal(1);
          expect(childCount).to.equal(1);
          expect(grandchildCount).to.equal(1);
          done();
        })
        .catch(done);

    });

  });

});
