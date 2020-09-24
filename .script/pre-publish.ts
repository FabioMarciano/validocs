import file from 'fs';
import path from 'path';
import cfg from './cfg.json';

const origin = path.resolve(cfg.package);
const target = path.resolve(path.basename('dist'), cfg.package);

const data = require(origin);

(() => {
	cfg.exclude.forEach((key: string) => {
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
