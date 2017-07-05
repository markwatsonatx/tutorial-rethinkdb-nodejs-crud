#!/bin/sh
cd /usr/src/app
if [[ ! -z ${NPM_PROXY_CACHE} ]]; then
	# This is temporary until npm 5.0.4 is released (see https://github.com/npm/npm/issues/16868)
	export NODE_TLS_REJECT_UNAUTHORIZED="0"
	npm --proxy ${NPM_PROXY_CACHE} --https-proxy ${NPM_PROXY_CACHE} --strict-ssl false install
	npm --proxy ${NPM_PROXY_CACHE} --https-proxy ${NPM_PROXY_CACHE} --strict-ssl false install -g nodemon
else
	npm install
	npm install -g nodemon
fi
nodemon -L server.js