import _ from 'lodash';
import Promise from 'bluebird';
import sinon from 'sinon';
import { expect } from 'chai';

import endpointGenerator from '../src/endpoint-generator';

function rand() {
  return Math.random().toString(36).substring(7);
}

function randInt(lower, higher) {
  lower = lower || 1;
  higher = higher || 10;

  return Math.floor((Math.random() * higher) + lower);
}

describe('endpointGenerator', () => {

  describe('generate', () => {

    it('should allow chaining single child', (done) => {
      const baseIn = rand();
      const childIn = rand();
      const baseReturn = rand();
      const childReturn = rand();

      const baseStub = sinon.stub();
      baseStub.withArgs(baseIn).onCall(0).returns(baseReturn);
      baseStub.returns(null);

      const childStub = sinon.stub();
      childStub.withArgs(childIn).onCall(0).returns(childReturn);
      childStub.returns(null);

      const base = endpointGenerator.generate(baseStub, { child : childStub });

      return Promise
        .try(base, [baseIn])
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
          expect(baseStub.callCount).to.equal(1);
          expect(childStub.callCount).to.equal(1);
          done();
        })
        .catch(done);

    });

    it('should allow chaining grand child', (done) => {
      const baseIn = rand();
      const childIn = rand();
      const grandchildIn = rand();
      const baseReturn = rand();
      const childReturn = rand();
      const grandchildReturn = rand();

      const baseStub = sinon.stub();
      baseStub.withArgs(baseIn).onCall(0).returns(baseReturn);
      baseStub.returns(null);

      const childStub = sinon.stub();
      childStub.withArgs(childIn).onCall(0).returns(childReturn);
      childStub.returns(null);

      const grandchildStub = sinon.stub();
      grandchildStub.withArgs(grandchildIn).onCall(0).returns(grandchildReturn);
      grandchildStub.returns(null);

      const child = endpointGenerator.generate(childStub, { grandchild : grandchildStub });
      const base = endpointGenerator.generate(baseStub, { child });

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

          return base(baseIn).child(childIn).grandchild(grandchildIn);
        })
        .then((grandChildValue) => {
          expect(grandChildValue).to.equal(grandchildReturn);
        })
        .then(() => {
          expect(baseStub.callCount).to.equal(1);
          expect(childStub.callCount).to.equal(1);
          expect(grandchildStub.callCount).to.equal(1);
          done();
        })
        .catch(done);

    });

    it('should allow unknown number of descendants', (done) => {
      const numberOfChildren = randInt(3, 100);
      let stubs = [];
      let inputs = [];
      let outputExpected = [];

      for (let i = 0; i < numberOfChildren; i++) {
        const input = rand();
        const output = rand();
        const stub = sinon.stub();
        stub.withArgs(input).onCall(0).returns(output);
        stub.returns(null);
        stub.position = i;

        outputExpected.push(output);
        inputs.push(input);
        stubs.push(stub);
      }

      let callPromise = endpointGenerator.generate(
        stubs[numberOfChildren - 2],
        { [numberOfChildren - 1] : stubs[numberOfChildren - 1] }
      );

      for (let i = stubs.length - 2; i > 0; i--) {
        callPromise = endpointGenerator.generate(stubs[i - 1], { [i] : callPromise });
      }

      let currentResult = callPromise(inputs[0]);

      for (let i = 1; i < stubs.length; i++) {
        try {
          currentResult = currentResult[i](inputs[i]);
        } catch(err) {
          throw new Error('[i:' + i + '] :' + err.toString());
        }
      }

      return currentResult.then((finalResult) => {
        expect(finalResult).to.equal(outputExpected[inputs.length - 1]);
      })
      .then(() => {
        return Promise.each(_.dropRight(stubs, 1), (stub, key) => {
          expect(stub.callCount).to.equal(0, 'Failed on #' + key);
        }).then(() => {
          expect(stubs[numberOfChildren - 1].callCount).to.equal(1);
        });
      })
      .then(done)
      .catch(done);
    });

  });

});
