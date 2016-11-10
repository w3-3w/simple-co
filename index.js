const symbolRace = require('./symbol-race');

function co(gen) {
	return new Promise((resolve, reject) => {
		const pointer = gen();
		function exec(err, v) {
			try {
				const pResult = err ? pointer.throw(err) : pointer.next(v);
				// Is generator done?
				if (pResult.done) {
					// Generator is done
					// Resolve the Promise returned by co
					resolve(pResult.value);
				} else {
					// Generator is not done yet
					function onResolved(result) {
						exec(null, result);
					}
					function onRejected(err) {
						exec(err);
					}
					const pResultValue = pResult.value;
					// Is yield a Promise?
					if (pResultValue instanceof Promise) {
						// Yield is a Promise, deal with it
						pResultValue.then(onResolved, onRejected);
					} else
					// Is Yield an array of Promises?
					if (pResultValue instanceof Array &&
							pResultValue.some((item) => (item instanceof Promise))) {
						// Yield is an array of Promises
						// Which way should we wrap these Promises? (all/race)
						const wrap = pResultValue[0] === symbolRace ?
							Promise.race.bind(Promise) :
							Promise.all.bind(Promise);
						wrap(pResultValue.filter((item) => (item instanceof Promise)))
							.then(onResolved, onRejected);
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
		exec();
	});
}

module.exports = co;