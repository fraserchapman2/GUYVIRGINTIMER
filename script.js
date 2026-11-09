(function () {
  "use strict";

  // The moment it all began: midnight at the start of 28 June 2023, UK time (BST, UTC+1).
  // Pinning it to a real instant means everyone sees the same numbers wherever they are.
  var ORIGIN = new Date("2023-06-28T00:00:00+01:00");

  var SECOND = 1000;
  var MINUTE = 60 * SECOND;
  var HOUR = 60 * MINUTE;
  var DAY = 24 * HOUR;

  // Whole years first (calendar-aware, so leap years are right), then the remainder.
  function breakdown(now) {
    var years = now.getUTCFullYear() - ORIGIN.getUTCFullYear();
    var anchor = new Date(ORIGIN.getTime());
    anchor.setUTCFullYear(ORIGIN.getUTCFullYear() + years);
    if (anchor > now) {
      years--;
      anchor = new Date(ORIGIN.getTime());
      anchor.setUTCFullYear(ORIGIN.getUTCFullYear() + years);
    }
    var rest = now - anchor;
    return {
      years: years,
      days: Math.floor(rest / DAY),
      hours: Math.floor((rest / HOUR) % 24),
      minutes: Math.floor((rest / MINUTE) % 60),
      seconds: Math.floor((rest / SECOND) % 60)
    };
  }

  function fmt(n, dp) {
    dp = dp || 0;
    return n.toLocaleString("en-GB", { minimumFractionDigits: dp, maximumFractionDigits: dp });
  }

  // The same stretch of time, expressed in other units.
  function stats(now) {
    var ms = now - ORIGIN;
    var mins = ms / MINUTE;
    var days = ms / DAY;
    return {
      days: fmt(Math.floor(days)),
      hours: fmt(Math.floor(ms / HOUR)),
      minutes: fmt(Math.floor(mins)),
      seconds: fmt(Math.floor(ms / SECOND)),
      matches: fmt(Math.floor(mins / 90)),                 // 90 minutes a match
      seasons: fmt(mins / (380 * 90), 1),                  // 380 games in a league season
      moons: fmt(Math.floor(days / 29.53)),                // synodic month
      sundays: fmt(Math.floor(days / 7)),
      moontrips: fmt(Math.floor(days / 3)),                // roughly 3 days one way, Apollo-style
      heartbeats: fmt(Math.floor(mins * 70))               // roughly 70 beats a minute
    };
  }

  function milestone(now) {
    var step = 250;
    var days = (now - ORIGIN) / DAY;
    var nextDay = (Math.floor(days / step) + 1) * step;
    var left = ORIGIN.getTime() + nextDay * DAY - now.getTime();
    return { nextDay: nextDay, left: left, progress: (days % step) / step };
  }

  function setAll(selector, attr, values) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute(attr);
      if (values[key] !== undefined) els[i].textContent = values[key];
    }
  }

  function tick() {
    var now = new Date();

    // Timer page
    if (document.querySelector("[data-unit]")) {
      setAll("[data-unit]", "data-unit", breakdown(now));
    }

    // Rotating fun fact under the timer (changes every 6 seconds)
    var factEl = document.getElementById("factline");
    if (factEl) {
      var s = stats(now);
      var facts = [
        "That's " + s.matches + " football matches, back to back.",
        "Roughly " + s.moons + " full moons have come and gone.",
        "Enough time for " + s.moontrips + " one-way trips to the Moon.",
        "That's " + s.seasons + " whole Premier League seasons of matches.",
        s.sundays + " Sundays. Not one roast dinner for two."
      ];
      factEl.textContent = facts[Math.floor(now.getTime() / 6000) % facts.length];
    }

    // Stats page
    if (document.querySelector("[data-stat]")) {
      setAll("[data-stat]", "data-stat", stats(now));
    }

    var dayEl = document.getElementById("milestone-day");
    if (dayEl) {
      var m = milestone(now);
      var d = Math.floor(m.left / DAY);
      var h = Math.floor((m.left / HOUR) % 24);
      var mi = Math.floor((m.left / MINUTE) % 60);
      dayEl.textContent = "Day " + fmt(m.nextDay);
      document.getElementById("milestone-left").textContent =
        "arrives in " + d + "d " + h + "h " + mi + "m";
      document.getElementById("milestone-bar").style.width = (m.progress * 100).toFixed(1) + "%";
    }
  }

  tick();
  setInterval(tick, 1000);

  // Click a photo to enlarge it
  var box = document.getElementById("lightbox");
  if (box) {
    var big = box.querySelector("img");
    var cap = box.querySelector("p");
    var figures = document.querySelectorAll(".gallery figure");
    for (var i = 0; i < figures.length; i++) {
      figures[i].addEventListener("click", function () {
        var img = this.querySelector("img");
        big.src = img.src;
        big.alt = img.alt;
        cap.textContent = img.alt;
        box.hidden = false;
      });
    }
    box.addEventListener("click", function () { box.hidden = true; });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") box.hidden = true;
    });
  }
})();
