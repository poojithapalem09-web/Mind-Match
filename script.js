const board = document.getElementById("gameBoard");
const movesText = document.getElementById("moves");
const timerText = document.getElementById("timer");
const restartBtn = document.getElementById("restart");
const message = document.getElementById("message");
const flowerContainer = document.getElementById("flower-container");
const celebrationContainer = document.getElementById("celebration-container");

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");

const matchSound = document.getElementById("matchSound");
const winSound = document.getElementById("winSound");
const bgMusic = document.getElementById("bgMusic");

let cards = ["🍎","🍌","🍇","🍓","🍎","🍌","🍇","🍓"];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let time = 0;
let timerInterval;

/* AUDIO UNLOCK */
let audioUnlocked = false;
function unlockAudio() {
  if (!audioUnlocked) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(()=>{});
    audioUnlocked = true;
  }
}

/* SHUFFLE */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* CREATE BOARD */
function createBoard() {
  board.innerHTML = "";
  shuffle(cards);

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${symbol}</div>
      </div>`;
    card.onclick = () => flipCard(card, symbol);
    board.appendChild(card);
  });
}

/* TIMER */
function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    timerText.textContent = time;
  }, 1000);
}

/* FLIP */
function flipCard(card, symbol) {
  unlockAudio();
  if (flippedCards.length === 2 || card.classList.contains("flip")) return;

  if (moves === 0 && flippedCards.length === 0) startTimer();

  card.classList.add("flip");
  flippedCards.push({ card, symbol });

  if (flippedCards.length === 2) {
    moves++;
    movesText.textContent = moves;
    setTimeout(checkMatch, 700);
  }
}

/* FLOWERS */
function flowerShower(count = 20) {
  for (let i = 0; i < count; i++) {
    const f = document.createElement("span");
    f.className = "flower";
    f.textContent = "🌸";
    f.style.left = Math.random() * 100 + "vw";
    flowerContainer.appendChild(f);
    setTimeout(() => f.remove(), 3000);
  }
}

/* WIN BLAST */
function celebrationBlast(count = 80) {
  celebrationContainer.innerHTML = "";
  const emojis = ["🎉","🎊","🥳","🎂","✨","💥"];

  for (let i = 0; i < count; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    c.style.left = "50%";
    c.style.top = "50%";

    c.style.setProperty("--x", (Math.random()-0.5)*700+"px");
    c.style.setProperty("--y", (Math.random()-0.5)*700+"px");

    celebrationContainer.appendChild(c);
  }

  setTimeout(() => celebrationContainer.innerHTML = "", 1800);
}

/* CHECK MATCH */
function checkMatch() {
  const [a, b] = flippedCards;

  if (a.symbol === b.symbol) {
    matchedCount += 2;
    message.textContent = "🌸 Perfect Match!";
    matchSound.play();
    flowerShower();
    if (matchedCount === cards.length) gameComplete();
  } else {
    message.textContent = "💥 Try Again!";
    a.card.classList.add("blast");
    b.card.classList.add("blast");

    setTimeout(() => {
      a.card.classList.remove("flip","blast");
      b.card.classList.remove("flip","blast");
    }, 500);
  }

  flippedCards = [];
}

/* GAME COMPLETE */
function gameComplete() {
  clearInterval(timerInterval);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  winSound.play();
  message.textContent = "🎉 YOU WON! 🎉";
  celebrationBlast();
}

/* BUTTONS */
startBtn.onclick = () => {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  createBoard();
};

restartBtn.onclick = () => location.reload();
