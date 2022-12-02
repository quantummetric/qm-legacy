/**
 * Combine a list of single-arity functions into a single-arity function
 * that applies the list of functions left to right.
 */
function flow(...fns) {
    return function applyAllToArg(argument) {
        return fns.reduce((result, fn) => fn(result), argument);
    };
}

function compose(...fns) {
    return flow(...fns.reverse());
}

function curry(fn, ...someArgs) {
    return (...moreArgs) => fn(...[...someArgs, ...moreArgs]);
}

function curryRight(fn, ...someArgs) {
    return (...moreArgs) => fn(...[...someArgs, ...moreArgs].reverse());
}

function wrapMiddleware(handler, ...middleware) {
    return compose(...middleware)(handler);
}

function identity(x) {
    return x;
}

function and(...preds) {
    return function applyAndPredicates(...xs) {
        if (preds.length === 0) {
            return true;
        }
        const [ pred, ...rest ] = preds;


        return pred(...xs) && and(...rest)(...xs);
    };
}

function or(...preds) {
    return function applyOrPredicates(...xs) {
        if (preds.length === 0) {
            return false;
        }
        const [ pred, ...rest ] = preds;


        return pred(...xs) || or(...rest)(...xs);
    };
}

function not(pred) {
    return function applyNotPred(x) {
        return !pred(x);
    };
}

function flatMap(fn, xs) {
    return xs.reduce((acc, x) => acc.concat([...fn(x)]), []);
}

module.exports = {
    flow,
    compose,
    curry,
    curryRight,
    wrapMiddleware,
    identity,
    and,
    or,
    not,
    flatMap
};
