import React from "react";

const GRID_SIZE = 9;
const CASTLE_POS = { x: 4, y: 4 };

function buildDefaultPath() {
  const path = [];
  const min = 2;
  const max = 6;
  for (let x = min; x <= max; x++) path.push({ x, y: min, pathIndex: path.length });
  for (let y = min + 1; y <= max; y++) path.push({ x: max, y, pathIndex: path.length });
  for (let x = max - 1; x >= min; x--) path.push({ x, y: max, pathIndex: path.length });
  for (let y = max - 1; y > min; y--) path.push({ x: min, y, pathIndex: path.length });
  return path;
}

function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, (_, y) =>
    Array.from({ length: GRID_SIZE }, (_, x) => ({
      x,
      y,
      terrain: "ground",
      isCastle: false,
      isPath: false,
      towers: [],
      enemies: [],
    }))
  );
}

export default function BattleMapGrid({ mapLayout, castle, towers, enemies }) {
  const grid = createEmptyGrid();
  const layoutName = (mapLayout?.name || "").toLowerCase();

  let terrainClass = "terrain-grass";
  if (layoutName.includes("gelad")) terrainClass = "terrain-ice";
  else if (layoutName.includes("deserto")) terrainClass = "terrain-desert";
  else if (layoutName.includes("pântano")) terrainClass = "terrain-swamp";
  else if (layoutName.includes("cânion") || layoutName.includes("ardente") || layoutName.includes("vulcão"))
    terrainClass = "terrain-volcano";

  grid[CASTLE_POS.y][CASTLE_POS.x].isCastle = true;

  const basePath = buildDefaultPath();
  basePath.forEach((pos) => {
    if (grid[pos.y] && grid[pos.y][pos.x]) {
      grid[pos.y][pos.x].isPath = true;
      grid[pos.y][pos.x].pathIndex = pos.pathIndex;
    }
  });

  const activeEnemies = enemies || [];
  const sortedPath = [...basePath].sort((a, b) => a.pathIndex - b.pathIndex);
  activeEnemies.forEach((enemy, idx) => {
    const pathPos = sortedPath[Math.min(idx, sortedPath.length - 1)];
    const cell = grid[pathPos.y][pathPos.x];
    cell.enemies.push(enemy);
  });

  const towerSpots = [
    { x: CASTLE_POS.x - 1, y: CASTLE_POS.y - 1 },
    { x: CASTLE_POS.x, y: CASTLE_POS.y - 1 },
    { x: CASTLE_POS.x + 1, y: CASTLE_POS.y - 1 },
    { x: CASTLE_POS.x - 1, y: CASTLE_POS.y },
    { x: CASTLE_POS.x + 1, y: CASTLE_POS.y },
    { x: CASTLE_POS.x - 1, y: CASTLE_POS.y + 1 },
    { x: CASTLE_POS.x, y: CASTLE_POS.y + 1 },
    { x: CASTLE_POS.x + 1, y: CASTLE_POS.y + 1 },
  ];

  (towers || []).forEach((tower, idx) => {
    const spot = towerSpots[idx % towerSpots.length];
    const cell = grid[spot.y]?.[spot.x];
    if (cell) cell.towers.push(tower);
  });

  return (
    <div className="ks-map-grid2">
      {grid.map((row, y) => (
        <div className="ks-map-row" key={y}>
          {row.map((cell) => {
            const key = `${cell.x}-${cell.y}`;
            const classes = ["ks-map-cell", terrainClass];
            if (cell.isPath) classes.push("is-path");
            if (cell.isCastle) classes.push("is-castle");
            if (cell.towers.length) classes.push("has-tower");
            if (cell.enemies.length) classes.push("has-enemy");

            const enemy = cell.enemies[0];
            const tower = cell.towers[0];

            return (
              <div className={classes.join(" ")} key={key}>
                {cell.isCastle && (
                  <div className="ks-cell-content castle">
                    <span className="ks-cell-icon">🏰</span>
                    <span className="ks-cell-label">
                      {Math.round(castle?.hp ?? 0)}/{castle?.max_hp ?? 0}
                    </span>
                  </div>
                )}

                {!cell.isCastle && tower && (
                  <div className="ks-cell-content tower">
                    <span className="ks-cell-icon">🏹</span>
                    <span className="ks-cell-label">Lv {tower.level}</span>
                  </div>
                )}

                {!cell.isCastle && enemy && (
                  <div className="ks-cell-content enemy">
                    <span className="ks-cell-icon">{enemy.icon || "👹"}</span>
                    <span className="ks-cell-label">
                      {Math.max(1, Math.round((enemy.hp / enemy.max_hp) * 100))}%
                    </span>
                    {enemy.boss && <span className="ks-boss-tag">BOSS</span>}
                  </div>
                )}

                {!cell.isCastle && !tower && !enemy && cell.isPath && (
                  <div className="ks-cell-path-indicator" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
