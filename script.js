// Trigger celebration at 1pm UK (12:00 UTC on June 28, 2025)
const triggerTime = new Date("2025-06-28T12:00:00Z");
let celebrationStarted = false;

// Load & loop the celebration sound
const audio = new Audio("celebration.mp3");
audio.loop = true;

function updateTimer() {
  const now = new Date();

  // Calculate elapsed since the true 2-year origin
  const originDate = new Date('2023-06-28T00:00:00');
  const totalDiff = now - originDate;

  const years   = Math.floor(totalDiff / (1000 * 60 * 60 * 24 * 365));
  const days    = Math.floor((totalDiff / (1000 * 60 * 60 * 24)) % 365);
  const hours   = Math.floor((totalDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((totalDiff / 1000) % 60);

  document.getElementById("countup").innerText =
    `${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;

  // At or after 1pm UK, fire off the infinite party once
  if (now >= triggerTime && !celebrationStarted) {
    triggerCelebration();
    celebrationStarted = true;
  }
}

function triggerCelebration() {
  audio.play();

  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    zIndex: 9999
  });
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

  fireworks.start(); // infinite fireworks 🎆
}

setInterval(updateTimer, 1000);
updateTimer();
