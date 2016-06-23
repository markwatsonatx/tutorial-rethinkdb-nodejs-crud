var Promise = require('bluebird');
var r = require('rethinkdb');

module.exports.getGames = function(req) {
	var conn = req.app.get('rethinkdb.conn');
	return r.table('games').run(conn).then(function(cursor) {
		return cursor.toArray();
	});
};

module.exports.getGameById = function(req) {
	var conn = req.app.get('rethinkdb.conn');
	var id = req.query.id;
	return r.table('games').get(id).run(conn);
};

module.exports.createGame = function(req) {
	var conn = req.app.get('rethinkdb.conn');
	var game = {
		player1: req.body.game.player1,
		player2: req.body.game.player2,
		status: req.body.game.status
	}
	return r.table('games').insert(game).run(conn);
};

module.exports.updateGame = function(req) {
	var conn = req.app.get('rethinkdb.conn');
	var id = req.body.game.id;
	var game = {
		player1: req.body.game.player1,
		player2: req.body.game.player2,
		status: req.body.game.status
	}
	return r.table('games').get(id).update(game).run(conn);
};

module.exports.deleteGame = function(req) {
	var conn = req.app.get('rethinkdb.conn');
	var id = req.body.game.id;
	return r.table('games').get(id).delete().run(conn);
};