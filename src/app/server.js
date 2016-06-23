var bodyParser = require('body-parser');
var config = require('./config');
var databaseController = require('./controllers/databaseController');
var express = require('express');
var gameController = require('./controllers/gameController');
var r = require('rethinkdb');

var app = express();

(function(app) {
    r.connect(config.rethinkdb, function(err, conn) {
        if (err) {
            console.log('Could not open a connection to initialize the database: ' + err.message);
        }
        else {
            console.log('Connected.');
            app.set('rethinkdb.conn', conn);
            databaseController.createDatabase(conn, config.rethinkdb.db)
                .then(function() {
                    return databaseController.createTable(conn, 'games');
                })
                .catch(function(err) {
                    console.log('Error creating database and/or table: ' + err);
                })
        }
    });
})(app);

// set body parser for form data
app.use(bodyParser.urlencoded({
    extended: true
}));

// set view engine and map views directory
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// map requests
app.get('/', function(req, res) {
    gameController.getGames(req)
        .then(function(games) {
            res.render('index', {games: games});
        });
});

app.get('/create', function(req, res) {
    res.render('create', {});
});

app.get('/update', function(req, res) {
    gameController.getGameById(req)
        .then(function(game) {
            res.render('update', {game: game});
        });
});

// form submits
app.post('/create', function(req, res) {
    gameController.createGame(req)
        .then(function() {
            res.redirect("/");
        });
});

app.post('/update', function(req, res) {
    gameController.updateGame(req)
        .then(function() {
            res.redirect("/");
        });
});

app.post('/delete', function(req, res) {
    gameController.deleteGame(req)
        .then(function() {
            res.redirect("/");
        });
});

// start server on the specified port and binding host
app.listen(config.express.port, '0.0.0.0', function() {
  console.log("Server started.")
});
