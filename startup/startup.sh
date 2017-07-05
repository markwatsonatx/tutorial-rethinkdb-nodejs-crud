#!/bin/sh
cd /usr/src/app
npm config set ca=""
if [[ ! -z ${NPM_PROXY_CACHE} ]]; then
	npm --proxy ${NPM_PROXY_CACHE} --https-proxy ${NPM_PROXY_CACHE} --strict-ssl false install
	npm --proxy ${NPM_PROXY_CACHE} --https-proxy ${NPM_PROXY_CACHE} --strict-ssl false install -g nodemon
else
	npm install
	npm install -g nodemon
fi
nodemon -L server.js