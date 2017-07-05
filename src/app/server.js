const bodyParser = require('body-parser');
const cfenv = require('cfenv');
const config = require('./config');
const express = require('express');
const r = require('rethinkdb');
const DatabaseController = require('./controllers/databaseController');
const GameController = require('./controllers/gameController');

const appEnv = cfenv.getAppEnv();
const app = express();
const http = require('http').Server(app);

const databaseController = new DatabaseController();
const gameController = new GameController();

(function(app) {
    r.connect(config.rethinkdb, (err, conn) => {
        if (err) {
            console.log('Could not open a connection to initialize the database: ' + err.message);
        }
        else {
            console.log('Connected.');
            app.set('rethinkdb.conn', conn);
            databaseController.createDatabase(conn, config.rethinkdb.db)
                .then(() => {
                    return databaseController.createTable(conn, 'games');
                })
                .catch((err) => {
                    console.log('Error creating database and/or table: ' + err);
                })
        }
    });
})(app);

// set body parser for form data
app.use(bodyParser.urlencoded({
    extended: true
}));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// set view engine and map views directory
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// map requests
app.get('/', (req, res) => {
    gameController.getGames(req)
        .then((games) => {
            res.render('index', {games: games});
        });
});

app.get('/create', (req, res) => {
    res.render('create', {});
});

app.get('/update', (req, res) => {
    gameController.getGameById(req)
        .then((game) => {
            res.render('update', {game: game});
        });
});

// form submits
app.post('/create', (req, res) => {
    gameController.createGame(req)
        .then(() => {
            res.redirect("/");
        });
});

app.post('/update', (req, res) => {
    gameController.updateGame(req)
        .then(() => {
            res.redirect("/");
        });
});

app.post('/delete', (req, res) => {
    gameController.deleteGame(req)
        .then(() => {
            res.redirect("/");
        });
});

// get the app environment from Cloud Foundry
const port = appEnv.isLocal ? 3000 : appEnv.port;
const hostname = appEnv.isLocal ? '0.0.0.0' : appEnv.bind;;

http.listen(port, hostname, () => {
	console.log(`Server started on ${hostname}:${port}.`)
});
