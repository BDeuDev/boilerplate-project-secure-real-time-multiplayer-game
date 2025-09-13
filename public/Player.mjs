class Player {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = 0;
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
    return (
      this.x < collectible.x + 20 &&
      this.x + 20 > collectible.x &&
      this.y < collectible.y + 20 &&
      this.y + 20 > collectible.y
    );
  }
}

export default Player;
