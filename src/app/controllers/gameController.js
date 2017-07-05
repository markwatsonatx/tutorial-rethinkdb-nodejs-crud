'use strict';

const r = require('rethinkdb');

class GameController {

	getGames(req) {
		var conn = req.app.get('rethinkdb.conn');
		return r.table('games').run(conn).then((cursor) => {
			return cursor.toArray();
		});
	}

	getGameById(req) {
		var conn = req.app.get('rethinkdb.conn');
		var id = req.query.id;
		return r.table('games').get(id).run(conn);
	}

	createGame(req) {
		var conn = req.app.get('rethinkdb.conn');
		var game = {
			player1: req.body.game.player1,
			player2: req.body.game.player2,
			status: req.body.game.status
		}
		return r.table('games').insert(game).run(conn);
	}

	updateGame(req) {
		var conn = req.app.get('rethinkdb.conn');
		var id = req.body.game.id;
		var game = {
			player1: req.body.game.player1,
			player2: req.body.game.player2,
			status: req.body.game.status
		}
		return r.table('games').get(id).update(game).run(conn);
	}

	deleteGame(req) {
		var conn = req.app.get('rethinkdb.conn');
		var id = req.body.game.id;
		return r.table('games').get(id).delete().run(conn);
	}
}

module.exports = GameController;