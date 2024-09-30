import { expect } from 'chai';
import subject from './index.js';
import decimalPlaces from './decimalPlaces.js';
import formatBytes from './formatBytes.js';
import formatCurrency from './formatCurrency.js';
import formatDuration from './formatDuration.js';
import formatNumber from './formatNumber.js';
import humanizeDuration from './humanizeDuration.js';
import prefixWith from './prefixWith.js';
import suffixWith from './suffixWith.js';

describe('index', () => {
    it('index exports modules', () => {
        expect(subject.Maybe).to.be.a('function');
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

    it('format decimal places', () => {
        expect(decimalPlaces(0)(.01)).to.eq('0');
        const formatter = decimalPlaces(2);
        expect(formatter(123)).to.eq("123.00");
        expect(formatter(123.4)).to.eq("123.40");
        expect(formatter(123.456)).to.eq("123.46");
        expect(formatter(123.4567)).to.eq("123.46");
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

    it('formats duration', () => {
        expect(formatDuration()(100)).to.eq("0.10s");
        expect(formatDuration()(2300)).to.eq("2s");
        expect(formatDuration()(0)).to.eq("0s");
    })

    it('formats duration', () => {
        expect(humanizeDuration()(100)).to.eq("100 milliseconds");
        expect(humanizeDuration(true)(100)).to.eq("100 ms");
        expect(humanizeDuration()(2300)).to.eq("2.3 seconds");
        expect(humanizeDuration(true, 2)(2300)).to.eq("2.30 s");
        expect(humanizeDuration()(0)).to.eq("0 millisecond");
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
