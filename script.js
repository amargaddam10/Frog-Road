const frog = document.getElementById("frog");
const game = document.getElementById("game");
const statusText = document.getElementById("status");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const restartBtn = document.getElementById("restartBtn");

const jumpSound = document.getElementById("jumpSound");
const hitSound = document.getElementById("hitSound");
const winSound = document.getElementById("winSound");
const gameOverSound = document.getElementById("gameOverSound");

let frogX = 180;
let frogY = 0;
let score = 0;
let lives = 3;
let gameRunning = true;

function updateFrogPosition() {
  frog.style.left = `${frogX}px`;
  frog.style.bottom = `${frogY}px`;
}

function resetFrog() {
  frogX = 180;
  frogY = 0;
  updateFrogPosition();
}

function playSound(sound) {
  try {
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }
  } catch (_) {}
}

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  moveFrog(e.key);
});

function moveFrog(key) {
  if (!gameRunning) return;
  playSound(jumpSound);

  if (key === "ArrowLeft" && frogX > 0) frogX -= 40;
  else if (key === "ArrowRight" && frogX < 360) frogX += 40;
  else if (key === "ArrowUp" && frogY < 460) frogY += 40;
  else if (key === "ArrowDown" && frogY > 0) frogY -= 40;

  updateFrogPosition();
}

function createCar(laneY, speed) {
  const car = document.createElement("div");
  car.classList.add("car");
  car.style.bottom = `${laneY}px`;
  car.style.left = `-100px`;
  car.style.backgroundColor = getRandomColor();
  game.appendChild(car);

  let posX = -100;

  const interval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(interval);
      return;
    }

    posX += speed;
    car.style.left = `${posX}px`;

    const frogRect = frog.getBoundingClientRect();
    const carRect = car.getBoundingClientRect();

    if (
      frogRect.left < carRect.right &&
      frogRect.right > carRect.left &&
      frogRect.top < carRect.bottom &&
      frogRect.bottom > carRect.top
    ) {
      clearInterval(interval);
      if (car.parentNode) car.parentNode.removeChild(car);
      handleHit();
    }

    if (posX > 500) {
      clearInterval(interval);
      if (car.parentNode) car.parentNode.removeChild(car);
    }
  }, 20);
}

function spawnCars() {
  const lanes = [80, 160, 240, 320];
  return setInterval(() => {
    if (!gameRunning) return;
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const speed = 2 + Math.random() * 2;
    createCar(lane, speed);
  }, 1300);
}

function handleHit() {
  lives--;
  livesDisplay.innerText = `Lives: ${lives}`;
  statusText.innerText = `💥 You got hit!`;
  playSound(hitSound);

  if (lives <= 0) {
    endGame(false);
  } else {
    setTimeout(() => {
      statusText.innerText = "Keep going!";
      resetFrog();
    }, 1000);
  }
}

function checkWin() {
  // Win zone (top grass) before river
  if (frogY >= 400 && frogY < 460) {
    score++;
    scoreDisplay.innerText = `Score: ${score}`;
    statusText.innerText = "✅ Reached the top!";
    playSound(winSound);
    resetFrog();

    if (score >= 5) {
      endGame(true);
    }
    return;
  }

  // River = lose
  if (frogY >= 460) {
    statusText.innerText = "💦 You fell in the river!";
    playSound(gameOverSound);
    endGame(false);
  }
}

function endGame(won) {
  gameRunning = false;
  statusText.innerText = won ? "🎉 You win!" : "💀 Game Over!";
  if (!won) playSound(gameOverSound);
  restartBtn.style.display = "inline-block";
}

restartBtn.addEventListener("click", () => {
  score = 0;
  lives = 3;
  gameRunning = true;
  scoreDisplay.innerText = `Score: ${score}`;
  livesDisplay.innerText = `Lives: ${lives}`;
  statusText.innerText = "Use arrow keys or tap buttons to move!";
  restartBtn.style.display = "none";
  resetFrog();
});

function getRandomColor() {
  const colors = ["red", "blue", "yellow", "orange", "purple", "black"];
  return colors[Math.floor(Math.random() * colors.length)];

}

// Start everything
spawnCars();
setInterval(() => {
  if (gameRunning) checkWin();
}, 200);

// Place frog at start when game loads
resetFrog();


