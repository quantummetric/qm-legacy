import { expect } from 'chai';
import _ from './functional-util.js';

describe('functional utilities', function () {

    describe('composition', function() {

        it('should thread a value through functions right-to-left', function () {
            const addThenMult = _.compose(x => x * 2, x => x + 1);

            expect(addThenMult(5)).to.equal(12);
        });

        it('should apply a function when only one function given', function () {
            const inc = _.compose(x => x + 1);

            expect(inc(5)).to.equal(6);
        });

        it('should be the identity function when no functions given', function () {
            expect(_.compose()(5)).to.equal(5);
        });
    });

    describe('flow (reverse composition)', function() {

        it('should thread a value through functions left-to-right', function () {
            const multThenAdd = _.flow(x => x * 2, x => x + 1);

            expect(multThenAdd(5)).to.equal(11);
        });

        it('should apply a function when only one function given', function () {
            const inc = _.flow(x => x + 1);

            expect(inc(5)).to.equal(6);
        });

        it('should be the identity function when no functions given', function () {
            expect(_.flow()(5)).to.equal(5);
        });
    });

    describe('flatMap', function () {

        it('should flatten array result from mapping function into resulting array', function() {
            const selfAndNext = x => ([ x, x + 1 ]);

            expect(_.flatMap(selfAndNext, [10, 20, 30])).to.eql([10, 11, 20, 21, 30, 31]);
        });

        it('should flatten other iterable result from mapping function into resulting array', function() {
            function* prevAndSelfGenerator(x) {
                yield x - 1;
                yield x;
            };

            expect(_.flatMap(prevAndSelfGenerator, [10, 20, 30])).to.eql([9, 10, 19, 20, 29, 30]);
        });
    });
});
