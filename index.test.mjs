import { expect } from 'chai';
import subject from './index.js';
import formatBytes from './formatBytes.js';
import formatCurrency from './formatCurrency.js';
import formatDuration from './formatDuration.js';
import formatNumber from './formatNumber.js';
import prefixWith from './prefixWith.js';
import suffixWith from './suffixWith.js';

describe('index', () => {
    it('index exports modules', () => {
        expect(subject.functionalUtil).to.be.a('object');
        expect(subject.immutableOptics).to.be.a('object');
        expect(subject.immutableUtil).to.be.a('object');
    });
});

describe('Display', () => {
    it('exports functions', () => {
        expect(formatBytes).to.be.a("function");
        expect(formatDuration()).to.be.a("function");
        expect(formatNumber()).to.be.a("function");
        expect(prefixWith()).to.be.a("function");
        expect(suffixWith()).to.be.a("function");
    })

    it('formats positive numbers', () => {
        expect(formatCurrency(123.45)).to.eq("$123.45");
        expect(formatCurrency(123.456, "£")).to.eq("£123.46");
        expect(formatCurrency(123.4567, "€")).to.eq("€123.46");
    })

    it('formats negative numbers', () => {
        expect(formatCurrency(-123.45)).to.eq("$-123.45");
        expect(formatCurrency(-123.456, "£")).to.eq("£-123.46");
        expect(formatCurrency(-123.4567, "€")).to.eq("€-123.46");
    })

    it('creates a prefix function', () => {
        const subject = prefixWith('Quantum');
        expect(subject('Metric')).to.eq('QuantumMetric')
    })

    it("creates a suffix function", () => {
        const subject = suffixWith("Quantum");
        expect(subject("Metric")).to.eq("MetricQuantum");
    });
})
