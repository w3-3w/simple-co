# simple-co

simple generator async control flow goodness for node.js

## Usage

Completely the same as co!

## Restrictions

* Node.js >= 4.3.2
* Generators only
* yields other than `Promise`s will be returned as itself

## Example

```javascript
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