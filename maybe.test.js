const assert = require('node:assert')
const Maybe = require('./maybe.js')

const testData = { table: { rows: [{ metrics: ['b'] }] } }

const result = Maybe.fromNested(testData, ['table', 'rows', 0, 'metrcs', 0])

// assert not found condition where key is not the same
assert.deepEqual(undefined, result[Object.getOwnPropertySymbols(result)[0]])

const testData2 = { table: { rows: [{ metrics: ['test data here'] }] } }
const result2 = Maybe.fromNested(testData2, ['table', 'rows', 0, 'metrics', 0])

// assert data found condition equals result
assert.deepEqual('test data here', result2[Object.getOwnPropertySymbols(result2)[0]])

const testData3 = { table: { rows: ['no data'] } }
const result3 = Maybe.fromNested(testData3, ['table', 'rows', 0, 'metrics', 0])

// assert data found condition equals result
assert.deepEqual(undefined, result3[Object.getOwnPropertySymbols(result3)[0]])
