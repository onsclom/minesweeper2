const WIDTH = 9;
const HEIGHT = 9;
const MINES = 10;
const CELL_SIZE = 32;

const revealed = new Set<number>();
const flags = new Set<number>();
const bombs = new Set<number>();
while (bombs.size < MINES)
  bombs.add(Math.floor(Math.random() * WIDTH * HEIGHT));

const grid = document.getElementById("game") as HTMLDivElement;
grid.style.gridTemplateColumns = `repeat(${WIDTH}, ${CELL_SIZE}px)`;
update();

function update() {
  if ([...bombs.keys()].some((bomb) => revealed.has(bomb)))
    alert("You lost!"), location.reload();
  if (revealed.size === WIDTH * HEIGHT - MINES)
    alert("You won!"), location.reload();
  grid.innerHTML = "";
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.onclick = () => {
      revealed.add(i);
      if (bombCount(i) === 0) floodFill(i);
      update();
    };
    cell.oncontextmenu = (e) => {
      e.preventDefault();
      flags.has(i) ? flags.delete(i) : flags.add(i);
      update();
    };
    grid.appendChild(cell);
    if (flags.has(i)) cell.innerText = "🚩";
    if (revealed.has(i)) {
      const count = bombCount(i);
      if (count > 0) cell.innerText = count.toString();
    }
  }
}

function bombCount(cell: number) {
  const { x, y } = { x: cell % WIDTH, y: Math.floor(cell / WIDTH) };
  let count = 0;
  for (let y2 = y - 1; y2 <= y + 1; y2++)
    for (let x2 = x - 1; x2 <= x + 1; x2++) {
      const inBounds = x2 >= 0 && x2 < WIDTH && y2 >= 0 && y2 < HEIGHT;
      if (inBounds && bombs.has(y2 * WIDTH + x2)) count++;
    }
  return count;
}

function floodFill(cell: number) {
  const { x, y } = { x: cell % WIDTH, y: Math.floor(cell / WIDTH) };
  for (let y2 = y - 1; y2 <= y + 1; y2++)
    for (let x2 = x - 1; x2 <= x + 1; x2++) {
      const inBounds = x2 >= 0 && x2 < WIDTH && y2 >= 0 && y2 < HEIGHT;
      if (!inBounds) continue;
      const newCell = y2 * WIDTH + x2;
      if (bombCount(newCell) === 0 && !revealed.has(newCell)) {
        revealed.add(newCell);
        floodFill(newCell);
      } else if (bombCount(newCell) > 0) revealed.add(newCell);
    }
}
