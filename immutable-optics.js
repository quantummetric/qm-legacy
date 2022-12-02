const Immutable = require('immutable');

function traversal(traversalFn) {
    return function (fn) {
        return function (obj) {
            const paths = traversalFn(obj);
            return paths.reduce((obj, path) =>
                obj.updateIn(path, prev => fn(prev, path)), obj);
        };
    };
}

// TODO: Rename these, since they are not post/pre-order traversals, more like
// collectFor(Pre|Post)Order
function postOrderTraversal(obj) {
    if (Immutable.Iterable.isIterable(obj)) {
        return obj.keySeq()
            .flatMap(key => postOrderTraversal(obj.get(key))
                .map(path => path.unshift(key))
                .push(Immutable.List([key])))
            .toList();
    } else {
        return Immutable.List();
    }
}

function preOrderTraversal(obj) {
    if (Immutable.Iterable.isIterable(obj)) {
        return obj.keySeq()
            .flatMap(key => preOrderTraversal(obj.get(key))
                .map(path => path.unshift(key))
                .unshift(Immutable.List([key])))
            .toList();
    } else {
        return Immutable.List();
    }
}

module.exports = {
    traversal,
    postOrderTraversal,
    preOrderTraversal
}
