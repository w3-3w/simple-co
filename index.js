function co(gen) {
	return new Promise((resolve, reject) => {
		const pointer = gen();
		function exec(err, v) {
			try {
				const pResult = err ? pointer.throw(err) : pointer.next(v);
				// Is generator done?
				if (!(pResult.done)) {
					// Generator is not done yet
					const pResultValue = pResult.value;
					// Is yield a Promise?
					if (pResultValue instanceof Promise) {
						// Yield is a Promise, deal with it
						pResultValue.then(function(result){
							// If resolved
							exec(null, result);
						}, function(error){
							// If rejected
							exec(error);
						});
					} else {
						// Yield is not a Promise, pass the yield itself
						exec(null, pResultValue);
					}
				} else {
					// Generator is done
					// Resolve the Promise returned by co
					resolve(pResult.value);
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