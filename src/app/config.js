'use strict';

const url = require('url');
const fs = require('fs');
let services = null;
let connection = null;

// find RethinkDB credentials from Bluemix VCAP_SERVICES
if (typeof process.env.VCAP_SERVICES == "string") {
	try {
		services = JSON.parse(process.env.VCAP_SERVICES)
	} catch (e) {
		services = {}
	}
}

if (typeof services == "object" && services !== null &&
	typeof services["compose-for-rethinkdb"] == "object" &&
	services["compose-for-rethinkdb"].length > 0)
{

	let credentials = services["compose-for-rethinkdb"][0].credentials;
	let uri = url.parse(credentials.uri);
	connection = {
		host: uri.hostname,
		port: uri.port,
		user: uri.auth.split(":")[0],
		password: uri.auth.split(":")[1],
		ssl: {
			ca: new Buffer(credentials.ca_certificate_base64, "base64").toString("utf-8")
		},
		db: "rps"
	};
}
else {
	connection = {
		host: "db",
		port: 28015,
		authKey: "",
		db: "rps"
	};
}

module.exports = {
	rethinkdb: connection
};