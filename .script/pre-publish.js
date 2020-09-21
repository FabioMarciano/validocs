const file = require('fs');
const path = require('path');
const conf = require('./conf.json');

const origin = path.resolve(conf.package);
const target = path.resolve(path.basename('dist'), conf.package);

const data = require(origin);

(() => {
	conf.exclude.forEach((key) => {
		if (key in data) {
			delete data[key];
		}
	});

	file.writeFile(target, JSON.stringify(data, null, 2), (error) => {
		try {
			if (error) throw error;
		} catch (error) {
			console.log(error);
		}
	});
})();
