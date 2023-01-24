const { expect } = require('chai');
const subject = require('./immutable-optics.js');

describe('immutable-optics', () => {
    it('exports functions', () => {
        expect(subject.traversal).to.be.a('function');
        expect(subject.postOrderTraversal).to.be.a('function');
        expect(subject.preOrderTraversal).to.be.a("function");
    });
});

describe('traversal', () => {
    const { traversal } = subject;

    it('should traverse the object and apply the function to each element', () => {
        const obj = { a: { b: { c: 1 } } };
        const traversalFn = (o) => [['a', 'b', 'c']];
        const fn = (val, path) => val + 1;
        const updatedObj = traversal(traversalFn)(fn)(obj);
        expect(updatedObj).to.equal({ a: { b: { c: 2 } } });
    });
    it('should handle empty objects', () => {
        const obj = {};
        const traversalFn = (o) => [['a', 'b', 'c']];
        const fn = (val, path) => val + 1;
        const updatedObj = traversal(traversalFn)(fn)(obj);
        expect(updatedObj).to.equal({});
    });
    it('should handle non-objects', () => {
        const obj = 1;
        const traversalFn = (o) => [['a', 'b', 'c']];
        const fn = (val, path) => val + 1;
        const updatedObj = traversal(traversalFn)(fn)(obj);
        expect(updatedObj).to.equal(1);
    });
});
