import { expect } from 'chai';
import subject from './immutable-optics.js';

describe('immutable-optics', () => {
    it('exports functions', () => {
        expect(subject.traversal).to.be.a('function');
        expect(subject.postOrderTraversal).to.be.a('function');
        expect(subject.preOrderTraversal).to.be.a("function");
    });
});
