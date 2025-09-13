require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: '*' }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

// For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server);

const players = {};
let collectible = createCollectible();

function createCollectible() {
  return {
    id: Date.now(),
    x: Math.floor(Math.random() * 500),
    y: Math.floor(Math.random() * 500),
    value: 1,
  };
}

io.on('connection', (socket) => {
  console.log(`Jugador conectado: ${socket.id}`);

  players[socket.id] = { id: socket.id, x: 250, y: 250, score: 0 };

  socket.emit('init', { players, collectible });
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('move', (dir) => {
    const player = players[socket.id];
    if (!player) return;

    const step = 5;
    if (dir === 'up') player.y -= step;
    if (dir === 'down') player.y += step;
    if (dir === 'left') player.x -= step;
    if (dir === 'right') player.x += step;

    if (
      player.x < collectible.x + 20 &&
      player.x + 20 > collectible.x &&
      player.y < collectible.y + 20 &&
      player.y + 20 > collectible.y
    ) {
      player.score += collectible.value;
      collectible = createCollectible();
      io.emit('collectibleUpdate', collectible);
    }

    io.emit('state', players);
  });

  socket.on('disconnect', () => {
    console.log(`Jugador desconectado: ${socket.id}`);
    delete players[socket.id];
    io.emit('removePlayer', socket.id);
  });
});

// Start server + FCC test runner
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
