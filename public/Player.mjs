class Player {
  constructor({ id = Date.now(), x = 100, y = 100, score = 0 } = {}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = score;
  }

  movePlayer(direction, step) {
    if (direction === "up") this.y -= step;
    if (direction === "down") this.y += step;
    if (direction === "left") this.x -= step;
    if (direction === "right") this.x += step;
  }

  calculateRank(players) {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const rank = sorted.findIndex((p) => p.id === this.id) + 1;
    return `Rank: ${rank}/${players.length}`;
  }

  collision(collectible) {
    return this.x === collectible.x && this.y === collectible.y;
  }
}

export default Player;
