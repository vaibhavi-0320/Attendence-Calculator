const form = document.getElementById('form');
const totalEl = document.getElementById('total');
const attendedEl = document.getElementById('attended');
const requiredEl = document.getElementById('required');

const resultsBox = document.getElementById('results');
const currentP = document.getElementById('current');
const adviceP  = document.getElementById('advice');
const detailsP = document.getElementById('details');

function round2(n){ return Math.round(n * 100) / 100; }

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const total = Number(totalEl.value);
  const attended = Number(attendedEl.value);
  const req = Math.min(100, Math.max(1, Number(requiredEl.value))); // 1..100

  // basic validation
  if (total < 0 || attended < 0 || attended > total) {
    currentP.textContent = "Check your inputs: 'attended' cannot exceed 'total'.";
    adviceP.textContent = "";
    detailsP.textContent = "";
    resultsBox.classList.remove('hidden');
    currentP.className = "warn";
    return;
  }

  if (total === 0) {
    currentP.textContent = "No classes yet. Start attending to build your percentage.";
    adviceP.textContent = "";
    detailsP.textContent = "";
    resultsBox.classList.remove('hidden');
    currentP.className = "";
    return;
  }

  const currentPct = round2((attended / total) * 100);
  currentP.textContent = `Current Attendance: ${currentPct}%`;
  currentP.className = currentPct >= req ? "ok" : "warn";

  const r = req / 100;

  if (currentPct >= req) {
    // How many more can I skip and still stay >= req?
    // Condition: attended / (total + s) >= r  => s <= (attended / r) - total
    const sMax = Math.floor((attended / r) - total);
    const s = Math.max(0, sMax);
    adviceP.textContent = s > 0
      ? `You can still miss about ${s} class${s===1?'':'es'} and stay ≥ ${req}%.`
      : `You’re just at the threshold. Don’t miss the next class.`;
    // If you attend the next n classes, new %
    const attend1 = round2(((attended + 1) / (total + 1)) * 100);
    detailsP.textContent = `If you attend the next class, you'll be ~${attend1}%.`;
  } else {
    // How many must I attend consecutively to reach req?
    // (attended + a) / (total + a) >= r  => a >= (r*total - attended) / (1 - r)
    const need = Math.ceil((r * total - attended) / (1 - r));
    const a = Math.max(0, need);
    adviceP.textContent = `Attend the next ${a} class${a===1?'':'es'} in a row to reach ${req}%.`;
    const after = round2(((attended + a) / (total + a)) * 100);
    detailsP.textContent = `After attending ${a} more, you'll be about ${after}%.`;
  }

  resultsBox.classList.remove('hidden');
});
