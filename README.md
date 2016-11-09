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
  try {
    const asyncResult = yield new Promise((resolve, reject) => {
      // do something
      const success = true;
      if (success) {
        resolve('Your Result');
      } else {
        reject(new Error('Your Error'));
      }
    });
    // ...
  } catch(err) {
    console.error(err);
  }
});
```