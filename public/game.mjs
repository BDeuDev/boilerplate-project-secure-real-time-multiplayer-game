import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let players = {};
let collectible = null;

socket.on('init', (data) => {
  players = data.players;
  collectible = data.collectible;
  draw();
});

socket.on('newPlayer', (player) => {
  players[player.id] = player;
  draw();
});

socket.on('removePlayer', (id) => {
  delete players[id];
  draw();
});

socket.on('state', (serverPlayers) => {
  players = serverPlayers;
  draw();
});

socket.on('collectibleUpdate', (c) => {
  collectible = c;
  draw();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w') socket.emit('move', 'up');
  if (e.key === 'ArrowDown' || e.key === 's') socket.emit('move', 'down');
  if (e.key === 'ArrowLeft' || e.key === 'a') socket.emit('move', 'left');
  if (e.key === 'ArrowRight' || e.key === 'd') socket.emit('move', 'right');
});

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  Object.values(players).forEach((p) => {
    context.fillStyle = 'blue';
    context.fillRect(p.x, p.y, 20, 20);
    context.fillText(`Score: ${p.score}`, p.x, p.y - 5);
  });

  if (collectible) {
    context.fillStyle = 'red';
    context.fillRect(collectible.x, collectible.y, 20, 20);
  }
}
