# simple-co

simple generator async control flow goodness for node.js
which only supports Promise

## Usage

Yield Promise to wait for it resolved to continue. The resolved result will be passed.

Yield array of Promise to wait for them all resolved to continue. The array of resolved results will be passed.

Yield array of Promise whose first element is the very symbol exported by `symbol-race.js` to wait for the fastest Promise resolved to continue. The resolved result of the fastest Promise will be passed.

Once a Promise is rejected, the corresponding error will be thrown. If it is not properly catched in generator, execution will be halted and the Promise returned by `co` will be rejected.

## Restrictions

* Node.js >= 4.3.2
* Yields other than `Promise`s　or array of `Promise`s will be passed as it is
* Elements which are not `Promise`s in array will be ignored

## Example

```javascript
var co = require('simple-co');
co(function*(){
  // errors can be try/catched
  try {
    const asyncResult = yield new Promise((resolve, reject) => {
      // do something ...
      const success = true;
      if (success) {
        resolve('Your Result');
      } else {
        reject(new Error('Your Error'));
      }
    });
    // do something ...
  } catch(err) {
    console.error(err);
  }
  // do something ...
}).catch(function(err){
  // handle uncaught error
  console.error(err);
});
```

## Todo

* add tests