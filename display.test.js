const { expect } = require("chai");
const Display = require("./display.js");

describe('Display', () => {
    it('exports functions', () => {
        expect(Display).to.be.a("function");
        expect(Display.default).to.be.a("function");
        expect(Display.formatBytes).to.be.a("function");
        expect(Display.formatDuration).to.be.a("function");
        expect(Display.formatDuration()).to.be.a("function");
        expect(Display.formatNumber).to.be.a("function");
        expect(Display.formatNumber()).to.be.a("function");
        expect(Display.prefixWith()).to.be.a("function");
        expect(Display.suffixWith()).to.be.a("function");
    })
    
    it('formats positive numbers', () => {
        expect(Display.formatCurrency(123.45)).to.eq("$123.45");
        expect(Display.formatCurrency(123.456, "£")).to.eq("£123.46");
        expect(Display.formatCurrency(123.4567, "€")).to.eq("€123.46");
    })

    it('formats negative numbers', () => {
        expect(Display.formatCurrency(-123.45)).to.eq("$-123.45");
        expect(Display.formatCurrency(-123.456, "£")).to.eq("£-123.46");
        expect(Display.formatCurrency(-123.4567, "€")).to.eq("€-123.46");
    })

    it('creates a prefix function', () => {
        const subject = Display.prefixWith('Quantum');
        expect(subject('Metric')).to.eq('QuantumMetric')
    })

    it("creates a suffix function", () => {
        const subject = Display.suffixWith("Quantum");
        expect(subject("Metric")).to.eq("MetricQuantum");
    });
})
