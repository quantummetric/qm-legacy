const Immutable = require('immutable');

/**
 * Creates a cache around a function that only takes immutable objects as parameters
 * @param fn
 * @returns {cached(fn)}
 */
function immMemoize(fn) {
    let iMap = Immutable.Map();
    return (...args) => {
        const aList = Immutable.List(args);
        if (!iMap.has(aList)) {
            iMap = iMap.set(aList, fn(...args));
        }
        return iMap.get(aList);
    };
}

//quick alias for getting an immutable list
function list (...elements) {
    return Immutable.List(elements);
}

function walk(root, path = Immutable.List()) {
    return Immutable.Iterable.isIterable(root) ?
        Immutable.Map().set(path, root)
            .toKeyedSeq()
            .concat(root
                .toKeyedSeq()
                .flatMap((value, key) => walk(value, path.push(key)))) :
        Immutable.Map().set(path, root);
}

function patch(obj, patchSeq) {
    return patchSeq
        .entrySeq()
        .sortBy(([path]) => path.count())
        .reduce((obj, [path, value]) => {
            try {
                return obj.setIn(path, value);
            } catch (e) {
                throw new Error(`Unable to set ${path} to ${value} in ${obj}`);
            }
        }, obj);
}

function remove(obj, removeSeq) {
    return removeSeq.reduce((obj, path) => {
        try {
            return obj.deleteIn(path);
        } catch (err) {
            throw new Error(`Unable remove ${path}`);
        }
    }, obj);
}

function startsWith (a, b) {
    return Immutable.is(a.take(b.count()), b);
}

function endsWith (a, b) {
    return Immutable.is(a.takeLast(b.count()), b);
}

function isInstance(Record) {
    return function checkRecordType(maybeRecord) {
        return maybeRecord instanceof Record;
    };
}

function ImmutableRecordMemoize(RecordClass) {
    const propNames = Object.getOwnPropertyNames(RecordClass.prototype)
        .filter(propName => propName !== 'constructor');
    const memoMap = new WeakMap();
    return propNames.reduce((UpdatedRecordClass, propName) => {
        const descriptor = Object.getOwnPropertyDescriptor(UpdatedRecordClass.prototype, propName);
        const type = 'get' in descriptor ? 'get' : 'value';

        const callFn = descriptor[type];

        const memoization = function(...args) {
            const mem = memoMap.get(this) || Immutable.Map();
            const memKey = Immutable.List(args).unshift(propName);
            const newMem = mem.has(memKey) ? mem : mem.set(memKey, callFn.apply(this, args));
            memoMap.set(this, newMem);
            return newMem.get(memKey);
        };

        if (typeof(callFn) === 'function') {
            Object.defineProperty(UpdatedRecordClass.prototype, propName, {
                [type]: memoization
            });
        }
        return UpdatedRecordClass;
    }, RecordClass);
}

function cartesianProduct(...iterables) {
    return iterables.reduce((matrix, valueSet) =>
        valueSet.flatMap(entry => matrix.map(row => row.push(entry))),
    Immutable.fromJS([[]]));
}

function transpose(matrix) {
    return matrix.first()
        .zipWith((...xs) => Immutable.List(xs), ...matrix.rest());
}

function complement(...iterables) {
    const intersection = iterables.reduce((a, b) => a.toSet().intersect(b.toSet()));
    return Immutable.List(iterables).flatMap(x => x).filter(i => !intersection.has(i));
}

function splitIntoChunks(seq, chunkSize = 1) {
    const lst = Immutable.Seq(seq);
    function* gen() {
        for(let min=0; min < lst.count(); min=min+chunkSize) {
            yield lst.slice(min, min+chunkSize);
        }
    }
    return Immutable.Seq(gen());
}

/**
 * Applies `fn` to each element in `seq`, splitting it each time `fn` returns a new value
 *
 * @param {Immutable.Seq} seq Sequence<T> of values
 * @param {Function} fn Function<T,U> transforming an element of type T to a value of type U
 * @return {Immutable.List} Partitioned list
 */
function partitionBy(seq, fn) {
    return seq.reduce(({ acc, lastVal }, elem) => {
        const partitionValue = fn(elem);

        if (typeof lastVal === undefined || lastVal !== partitionValue) {
            return { acc: acc.push(Immutable.List([ elem ])), lastVal: partitionValue };
        }
        return {
            acc: acc.update(acc.count() - 1, lst => lst.push(elem)),
            lastVal: partitionValue
        };
    }, { acc: Immutable.List() }).acc;
}


module.exports = {
    immMemoize,
    list,
    walk,
    patch,
    remove,
    startsWith,
    endsWith,
    isInstance,
    ImmutableRecordMemoize,
    cartesianProduct,
    transpose,
    complement,
    splitIntoChunks,
    partitionBy
};
