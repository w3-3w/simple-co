const symbolRace = require('./symbol-race');

/**
 * Check if the an object is Promise
 */
function isPromise(obj) {
  return obj && obj instanceof Promise;
}

/**
 * co function to be exported
 */
function co(gen) {
  return new Promise((resolve, reject) => {
    const pointer = gen();
    function exec(err, v) {
      const onResolved = (result) => {
        exec(null, result);
      },
      onRejected = (err) => {
        exec(err);
      };
      try {
        // If error occurs, throw it, else continue execution
        const pResult = err ? pointer.throw(err) : pointer.next(v);
        // Is generator done?
        if (pResult.done) {
          // Generator is done
          // Resolve the Promise returned by co
          resolve(pResult.value);
        } else {
          // Generator is not done yet, deal with yield
          const pResultValue = pResult.value;
          // Is yield a Promise?
          if (isPromise(pResultValue)) {
            // Yield is a Promise
            pResultValue.then(onResolved, onRejected);
          } else
          // Is Yield an array of Promises, which contains at least one Promise?
          if (pResultValue && pResultValue instanceof Array &&
              pResultValue.some(isPromise)) {
            // Yield is an array of Promises
            // Which way should we treat these Promises? (all/race)
            if (pResultValue[0] === symbolRace) {
              Promise.race(pResultValue.filter(isPromise))
                .then(onResolved, onRejected);
            } else {
              Promise.all(pResultValue.filter(isPromise))
                .then(onResolved, onRejected);
            }
          } else {
            // Yield is not a Promise, nor an array of Promises, pass the yield itself
            onResolved(pResultValue);
          }
        }
      } catch(e) {
        // Uncaught errors in generator
        // Reject the Promise returned by co
        reject(e);
      }
    }
    // Execute generator function initially with no error and no previous value
    exec(null, null);
  });
}

module.exports = co;