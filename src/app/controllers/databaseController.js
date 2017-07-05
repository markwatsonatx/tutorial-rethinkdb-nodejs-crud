'use strict';

const r = require('rethinkdb');

class DatabaseController {

	constructor() {
	}

	createDatabase(conn, databaseName) {
		return r.dbList().run(conn).then((list) => {
			var dbFound = false;
			for (var i=0; i<list.length; i++) {
				if (list[i] == databaseName) {
					dbFound = true;
					break;
				}
			}
			if (! dbFound) {
				console.log('Creating database...');
				return r.dbCreate(databaseName).run(conn);
			}
			else {
				console.log('Database exists.');
				return Promise.resolve({dbs_exists:true});
			}
		});
	}

	createTable(conn, tableName) {
		return r.tableList().run(conn).then((list) => {
			var tableFound = false;
			for (var i=0; i<list.length; i++) {
				if (list[i] == tableName) {
					tableFound = true;
					break;
				}
			}
			if (! tableFound) {
				console.log('Creating table...');
				return r.tableCreate(tableName).run(conn);
			}
			else {
				console.log('Table exists.');
				return Promise.resolve({table_exists:true});
			}
		});
	}
}

// export the class
module.exports = DatabaseController;