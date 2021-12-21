const ONE_MINUTE = 60*1000; // default timeout

let cacheList = [];

class Cache {
	constructor () {
		this.resultCache = {};
		cacheList.push(this);
	}
	
	async fetch (key, lambda, timeout = ONE_MINUTE) {
		let now = Date.now();
		let cached = this.resultCache[key];
		
		if (cached === undefined || (cached.timestamp+timeout) < now) {
			// No cache or expired
			this.resultCache[key] = {
				timestamp: now,
				pending: []
			}
			try {
				let result = await lambda();
				this.resultCache[key].pending.forEach((waiter) => waiter.resolve(result));
				this.resultCache[key] = {
					data: result,
					timestamp: now
				}
				return result;
			}
			catch (err) {
				if (this.resultCache[key]) {
					this.resultCache[key].pending.forEach((waiter) => waiter.reject(err));
				}
				throw err;
			}
		}
		else if (cached.data === undefined && cached.pending !== undefined) {
			// Wait for data from pending request
			let wait = new Promise((resolve, reject) => {
				cached.pending.push({
					resolve,
					reject
				});
			});
			return await wait;
		}
		else {
			// Return cached data
			return cached.data;
		}
	}
	
	invalidate () {
		for (let key in this.resultCache) {
			this.resultCache[key].timestamp = 0;
		}
	}
	
	evict () {
	    this.resultCache = {};
	}
	
	static evictAll () {
	    cacheList.forEach(c => c.evict());
	}
}

module.exports = Cache;
