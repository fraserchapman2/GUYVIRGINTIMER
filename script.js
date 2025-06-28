const triggerTime = new Date("2025-06-28T12:00:00Z"); // 1pm UK = 12pm UTC
let celebrationStarted = false;

const audio = new Audio("celebration.mp3");
audio.loop = true;

function updateTimer() {
  const now = new Date();
  const diff = now - triggerTime;

  const originDate = new Date('2022-06-28T00:00:00');
  const totalDiff = now - originDate;

  const years = Math.floor(totalDiff / (1000 * 60 * 60 * 24 * 365));
  const days = Math.floor((totalDiff / (1000 * 60 * 60 * 24)) % 365);
  const hours = Math.floor((totalDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((totalDiff / 1000) % 60);

  document.getElementById("countup").innerText =
    `${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;

  if (now >= triggerTime && !celebrationStarted) {
    triggerCelebration();
    celebrationStarted = true;
  }
}

function triggerCelebration() {
  audio.play();

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = 0;
  container.style.left = 0;
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = 9999;
  document.body.appendChild(container);

  const fireworks = new Fireworks.default(container, {
    autoresize: true,
    opacity: 0.5,
    acceleration: 1.05,
    friction: 0.95,
    gravity: 1.5,
    particles: 70,
    trace: 5,
    explosion: 5
  });

  fireworks.start();
}

setInterval(updateTimer, 1000);
updateTimer();
