#! /usr/bin/env node

const find = require('find');
const fs = require('fs');
const path = require('path');

const CONTROLLERS_DIR = path.join(path.resolve(__dirname), '../controllers');
const INDENT = ' '.repeat(4);
const DIVIDE = '-'.repeat(80);

let format = process.argv[2] || 'markdown';

console.log(`
Quick API Documentation
=======================

Request body are assumed to be in JSON format.

This file was generated by ./scripts/quick-api-doc.js

${DIVIDE}
`.trim());

let API = [];

find.eachfile(/\.js$/, CONTROLLERS_DIR, module => {
	let currentAPI = null;

	const source = fs.readFileSync(module, 'utf8');
	const lines = source.split('\n');
	
	lines.filter(l => l.match(/\.(get|post|put|delete)|req\.body\.|^\s*\/\*\*|^\s*\*/))
		.forEach(l => {
			l = l.trim();

			if (l.match(/^\w+\.(get|post|put|delete)/)) {
				// Start of endpoint

				currentAPI = {}
				l = l.replace(/^\w+\./,'')
					.replace(/(get|post|put|delete)/, x => x.toUpperCase())
					.replace(/[()]/g,' ')
					.replace(/,\s*(async\s+)?req.*$/,'')
					.replace(/auth\.protect/,'`LOGIN REQUIRED`')
					.replace(/,\s*auth\.passport.*$/,'')
					.replace(/,\s*bodyparser.*$/,'')
					.replace(/'/g,'"');
				currentAPI.url = l;
				API.push(currentAPI);
			}
			else if(l.match(/^\s*\/\*\*|^\s*\*/)) {
				// Comments to include in documentation (must be inside the function)

				if (currentAPI) {
					l = l.replace(/[/*]/g,'').trim();
					if (!currentAPI.comments) currentAPI.comments = [];
					currentAPI.comments.push(l);
				}
			}
			else if(l.match(/req.body/)) {
				// Request params

				l = l.replace(/^.*=\s*req\.body\./,'')
					.replace(/;\s*$/g,'');
				if (!currentAPI.params) currentAPI.params = [];
				currentAPI.params.push(l);
			}

			if (l.match(/\/login/)) {
				if (!currentAPI.params) currentAPI.params = [];
				currentAPI.params.push('username');
				currentAPI.params.push('password');
			}
		})
})
.end(() => {
	if (format == 'json') {
		console.log(JSON.stringify(API, null, 2));
	}
	else {
		// assume markdown by default:
		API.forEach(api => {
			console.log(`\n## ${api.url}`);
			if (api.comments) {
				console.log(`${api.comments.join('\n')}`);
			}
			if (api.params) {
				console.log('\nrequest body:\n\n    {');
				let params = api.params.map(p => {
					return '        ' + p;
				});
				console.log(params.join(',\n'));
				console.log('    }');
			}
		});
	}
});
