#! /usr/bin/env node

const express = require('express');
const cors = require('cors');
const find = require('find');
const path = require('path');
const conf = require('./models/config');
const compress = require('express-compress').compress;

const app = express();

const CONTROLLERS_DIR = path.join(path.resolve(__dirname), 'controllers');

app.disable('x-powered-by');
app.enable('trust proxy');

const corsHeaders = [
	"Origin",
	"Accept",
	"X-Requested-With",
	"Content-Type",
	"Access-Control-Request-Method",
	"Access-Control-Request-Headers",
	"Authorization",
].join(',');

// Set up CORS
app.use(cors({
	origin: true,
	allowedHeaders: corsHeaders,
	exposedHeaders: corsHeaders,
	credentials: true,
	methods: 'POST,GET,PUT,OPTIONS,DELETE',
	maxAge: 3600
}));

app.use(compress({contentType: /json/}));

// Auto-load controllers:
find.eachfile(/\.js$/, CONTROLLERS_DIR, module => require(module)(app))
	.end(() => {
		// Error handler sends JSON instead of HTML
		app.use((err, req, res, next) => {
			if (err.code !== 'DONT_CARE') {
				console.error(err);
			}

			if (res.headersSent) {
				return next(err);
			}

			res.status(500);

			if (err.sqlMessage) {
				err.message = err.sqlMessage;
			}

			let errorMessage = {
				success: false,
				error: true,
				message: err.message ? err.message : err
			}

			res.json(errorMessage)
		})

		app.listen(conf.port,
			() => console.log(`Server started, listening on ${conf.port} ..`)
		);
	});
