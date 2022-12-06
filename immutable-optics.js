const Immutable = require('immutable');

// Define a function named "traversal" that accepts a traversal function as its argument
function traversal(traversalFn) {
  // Return a new function that accepts a transformation function as its argument
  return function(fn) {
    // Return a new function that accepts an object as its argument
    return function(obj) {
      // Use the traversal function to find the paths to each value in the object
      const paths = traversalFn(obj);

      // Apply the transformation function to each value in the object
      return paths.reduce(function(obj, path) {
        // Use the updateIn method to update the value at the specified path
        return obj.updateIn(path, function(prev) {
          // Call the transformation function with the previous value and the path
          return fn(prev, path);
        });
      }, obj);
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
  // Check if the input is an iterable
  if (Immutable.Iterable.isIterable(obj)) {
    // Create a list of all the keys in the iterable
    const keys = obj.keySeq().toList();

    // Map each key to the result of calling preOrderTraversal on its value
    const subPaths = keys.map(key => preOrderTraversal(obj.get(key)));

    // Flatten the list of subpaths and prepend each key to the beginning of each subpath
    return subPaths.flatten().map(path => path.unshift(key));
  } else {
    // If the input is not iterable, return an empty list
    return Immutable.List();
  }
}

module.exports = {
    traversal,
    postOrderTraversal,
    preOrderTraversal
}
