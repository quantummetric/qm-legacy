const { expect } = require("chai");
const subject = require("./index.js");

describe('index', () => {
    it('index exports modules', () => {
        expect(subject.Maybe).to.be.a('function');
        expect(subject.functionalUtil).to.be.a('object');
        expect(subject.immutableOptics).to.be.a('object');
        expect(subject.immutableUtil).to.be.a('object');
    });
});
