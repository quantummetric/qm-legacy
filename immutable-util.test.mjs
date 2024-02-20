import { expect } from 'chai';
import subject from './immutable-util.js';

describe('immutable-util', () => {
    it('exports functions', () => {
        expect(subject.endsWith).to.be.a('function');
        expect(subject.startsWith).to.be.a('function');
    })
});
