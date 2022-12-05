const chai = require('chai');
const _ = require('../src/functional-util');

describe('functional utilities', () => {
    describe('composition', () => {
        it('should thread a value through functions right-to-left', () => {
            const addThenMult = _.compose(
                (x) => x * 2,
                (x) => x + 1
            );

            chai.expect(addThenMult(5)).to.equal(12);
        });

        it('should apply a function when only one function given', () => {
            const inc = _.compose((x) => x + 1);

            chai.expect(inc(5)).to.equal(6);
        });

        it('should be the identity function when no functions given', () => {
            chai.expect(_.compose()(5)).to.equal(5);
        });
    });

    describe('flow (reverse composition)', () => {
        it('should thread a value through functions left-to-right', () => {
            const multThenAdd = _.flow(
                (x) => x * 2,
                (x) => x + 1
            );

            chai.expect(multThenAdd(5)).to.equal(11);
        });

        it('should apply a function when only one function given', () => {
            const inc = _.flow((x) => x + 1);

            chai.expect(inc(5)).to.equal(6);
        });

        it('should be the identity function when no functions given', () => {
            chai.expect(_.flow()(5)).to.equal(5);
        });
    });

    describe('flatMap', () => {
        it('should flatten array result from mapping function into resulting array', () => {
            const selfAndNext = (x) => [x, x + 1];

            chai.expect(_.flatMap(selfAndNext, [10, 20, 30])).to.eql([10, 11, 20, 21, 30, 31]);
        });

        it('should flatten other iterable result from mapping function into resulting array', () => {
            function* prevAndSelfGenerator(x) {
                yield x - 1;
                yield x;
            }

            chai.expect(_.flatMap(prevAndSelfGenerator, [10, 20, 30])).to.eql([
                9,
                10,
                19,
                20,
                29,
                30,
            ]);
        });
    });
});
