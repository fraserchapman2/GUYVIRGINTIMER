// The moment it all began (local time)
const originDate = new Date(2023, 5, 28, 0, 0, 0); // months are 0-indexed: 5 = June

function updateTimer() {
  const now = new Date();

  // Count whole calendar years first, so leap years are handled correctly
  let years = now.getFullYear() - originDate.getFullYear();
  let anchor = new Date(originDate);
  anchor.setFullYear(originDate.getFullYear() + years);
  if (anchor > now) {
    years--;
    anchor = new Date(originDate);
    anchor.setFullYear(originDate.getFullYear() + years);
  }

  // Everything left over after the whole years
  const rest    = now - anchor;
  const days    = Math.floor(rest / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((rest / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((rest / (1000 * 60)) % 60);
  const seconds = Math.floor((rest / 1000) % 60);

  document.getElementById("countup").innerText =
    years + "y " + days + "d " + hours + "h " + minutes + "m " + seconds + "s";
}

setInterval(updateTimer, 1000);
updateTimer();
