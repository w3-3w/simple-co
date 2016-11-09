function co(gen) {
	const p = gen();
	function execPointer(err, v) {
		const pResult = err ? p.throw(err) : p.next(v);
		if (!(pResult.done)) {
			const pResultValue = pResult.value;
			// Is yield a Promise?
			if (pResultValue instanceof Promise) {
				// If so, deal with the Promise
				pResultValue.then(function(result){
					execPointer(null, result);
				}, function(error){
					execPointer(error);
				});
			} else {
				// If not, return the value itself
				execPointer(null, pResultValue);
			}
		}
	}
	execPointer();
}

module.exports = co;