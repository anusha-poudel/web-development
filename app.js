/* ══════════════════════════════════════════
   NutriTrack – app.js
   Plain JavaScript. No frameworks.
   Sections:
     1. State (data variables)
     2. Goal update
     3. Totals calculator
     4. Add / Remove / Clear food
     5. Nudge (friendly tip) logic
     6. Nudge navigation
     7. Chart (Chart.js)
     8. Main render function
     9. Init
══════════════════════════════════════════ */
let foods      = [];
let goal       = 2000;
let nudgeIndex = 0;

/* We store a reference to the Chart.js chart
   so we can update it instead of recreating. */
let macroChart = null;


/* ── 2. Goal Update ───────────────────────
   Called when user types in the goal input. */
function updateGoal() {
  goal = parseInt(document.getElementById('goal-input').value) || 2000;
  render(); // re-draw everything
}


/* ── 3. Totals Calculator ─────────────────
   Adds up all macros from the foods array.
   Returns one object: { cal, pro, car, fat } */
function getTotals() {
  return foods.reduce(
    function(acc, food) {
      return {
        cal: acc.cal + food.cal,
        pro: acc.pro + food.pro,
        car: acc.car + food.car,
        fat: acc.fat + food.fat,
      };
    },
    { cal: 0, pro: 0, car: 0, fat: 0 } // starting values
  );
}


/* ── 4. Add / Remove / Clear Food ─────────*/

/* addFood: reads the 5 input fields and pushes
   a new food object into the foods array.     */
function addFood() {
  const name = document.getElementById('f-name').value.trim();
  const cal  = parseFloat(document.getElementById('f-cal').value)  || 0;
  const pro  = parseFloat(document.getElementById('f-pro').value)  || 0;
  const car  = parseFloat(document.getElementById('f-car').value)  || 0;
  const fat  = parseFloat(document.getElementById('f-fat').value)  || 0;

  // Don't add if name is empty
  if (!name) {
    document.getElementById('f-name').focus();
    return;
  }

  // Push food with a unique id (timestamp works fine here)
  foods.push({ name, cal, pro, car, fat, id: Date.now() });

  // Clear the input fields after adding
  ['f-name', 'f-cal', 'f-pro', 'f-car', 'f-fat'].forEach(function(id) {
    document.getElementById(id).value = '';
  });

  nudgeIndex = 0; // reset tip to first
  render();
}

/* quick: adds a pre-defined food in one click */
function quick(name, cal, pro, car, fat) {
  foods.push({ name, cal, pro, car, fat, id: Date.now() });
  nudgeIndex = 0;
  render();
}

/* removeFood: filters out the item with matching id */
function removeFood(id) {
  foods = foods.filter(function(f) { return f.id !== id; });
  nudgeIndex = 0;
  render();
}

/* clearAll: wipe the whole log */
function clearAll() {
  foods      = [];
  nudgeIndex = 0;
  render();
}


/* ── 5. Nudge Logic ───────────────────────
   Returns an array of friendly tip objects
   based on current totals. Only relevant
   tips are included (not all 6 at once).   */
function getNudges(t) {
  // No tips until user adds something
  if (foods.length === 0) return [];

  const nudges = [];

  /* Calorie tips */
  if (t.cal < 1200) {
    nudges.push({
      type: 'danger',
      main: 'Your energy is running low',
      sub:  'You\'ve had ' + Math.round(t.cal) + ' kcal so far. ' +
            'Try adding a meal — even something small like nuts, yogurt, or a banana helps.'
    });
  } else if (t.cal > goal * 1.1) {
    nudges.push({
      type: 'warn',
      main: 'You\'re a little over today',
      sub:  'No stress — just keep the next meal light. Think salad, soup, or fruit.'
    });
  } else if (t.cal >= goal * 0.85) {
    nudges.push({
      type: 'ok',
      main: 'Almost at your goal!',
      sub:  'Great progress! A small snack should get you there.'
    });
  }

  /* Protein tip */
  if (t.pro < 50) {
    nudges.push({
      type: 'warn',
      main: 'Protein could use a boost',
      sub:  'You\'re at ' + Math.round(t.pro) + 'g protein. ' +
            'Easy wins: add an egg, some chicken, lentils, or a handful of nuts.'
    });
  }

  /* Fat tip */
  if (t.fat < 20) {
    nudges.push({
      type: 'ok',
      main: 'Don\'t forget healthy fats',
      sub:  'A little avocado, olive oil, or some nuts goes a long way ' +
            'for energy and brain health.'
    });
  }

  /* Carb tip */
  if (t.car < 50) {
    nudges.push({
      type: 'ok',
      main: 'Your body might need more fuel',
      sub:  'Carbs are your main energy source. ' +
            'Try oats, rice, or some fruit when you get a chance.'
    });
  }

  /* All-good tip – only shows when nothing is wrong */
  if (nudges.length === 0) {
    nudges.push({
      type: 'great',
      main: 'You\'re doing great today! 🎉',
      sub:  'Calories, protein, carbs, and fat all look good. Keep it up!'
    });
  }

  return nudges;
}


/* ── 6. Nudge Navigation ──────────────────
   Lets user browse tips one at a time       */
function nextNudge() {
  const n = getNudges(getTotals());
  nudgeIndex = (nudgeIndex + 1) % n.length;
  renderNudge(n);
}

function prevNudge() {
  const n = getNudges(getTotals());
  nudgeIndex = (nudgeIndex - 1 + n.length) % n.length;
  renderNudge(n);
}

function goNudge(i) {
  nudgeIndex = i;
  renderNudge(getNudges(getTotals()));
}

/* renderNudge: builds the HTML for the nudge card */
function renderNudge(nudges) {
  const wrap = document.getElementById('nudge-wrap');

  // Hide the box when nothing logged
  if (foods.length === 0) { wrap.innerHTML = ''; return; }
  if (nudgeIndex >= nudges.length) nudgeIndex = 0;

  const n = nudges[nudgeIndex];

  // Pick a left-border color based on tip type
  const borderColor =
    n.type === 'danger' ? '#e24b4a' :
    n.type === 'warn'   ? '#f9813a' :
    n.type === 'great'  ? '#3aaa6e' : '#c8c5be';

  // Dot indicators (one dot per available tip)
  let dotsHTML = '';
  if (nudges.length > 1) {
    dotsHTML = '<div class="nudge-dots">' +
      nudges.map(function(nd, i) {
        let cls = (i === nudgeIndex)
          ? (nd.type === 'danger' ? 'danger' : nd.type === 'warn' ? 'warn' : 'active')
          : '';
        return '<div class="dot ' + cls + '" onclick="goNudge(' + i + ')"></div>';
      }).join('') +
    '</div>';
  }

  // Prev / Next navigation (only when multiple tips)
  let navHTML = '';
  if (nudges.length > 1) {
    navHTML =
      '<div class="nudge-nav">' +
        '<span class="nudge-count">' + (nudgeIndex + 1) + ' of ' + nudges.length + ' tips</span>' +
        '<div style="display:flex;gap:6px">' +
          '<button class="nav-btn" onclick="prevNudge()">←</button>' +
          '<button class="nav-btn" onclick="nextNudge()">→</button>' +
        '</div>' +
      '</div>';
  }

  wrap.innerHTML =
    '<div class="nudge-box" style="border-left-color:' + borderColor + '">' +
      '<div class="nudge-main">' + n.main + '</div>' +
      '<div class="nudge-sub">'  + n.sub  + '</div>' +
      dotsHTML +
      navHTML  +
    '</div>';
}


/* ── 7. Chart ─────────────────────────────
   Uses Chart.js to draw a doughnut chart
   showing Protein / Carbs / Fat calories.
   We use Chart.js only for the chart part;
   everything else is plain JS.             */
function renderChart(t) {
  const canvas = document.getElementById('macroChart');
  const ctx    = canvas.getContext('2d');

  // Convert grams → calories for the chart
  // Protein: 4 cal/g | Carbs: 4 cal/g | Fat: 9 cal/g
  const proKcal  = Math.round(t.pro * 4);
  const carKcal  = Math.round(t.car * 4);
  const fatKcal  = Math.round(t.fat * 9);

  // If no data, show placeholder zeros
  const hasData  = (proKcal + carKcal + fatKcal) > 0;
  const data     = hasData
    ? [proKcal, carKcal, fatKcal]
    : [1, 1, 1]; // equal slices as placeholder

  const labels = [
    'Protein (' + proKcal + ' kcal)',
    'Carbs ('   + carKcal + ' kcal)',
    'Fat ('     + fatKcal + ' kcal)',
  ];

  if (macroChart) {
    // Chart already exists → just update its data
    macroChart.data.datasets[0].data   = data;
    macroChart.data.labels             = labels;
    macroChart.options.plugins.subtitle.text =
      hasData ? 'Based on today\'s log' : 'Add food to see your breakdown';
    macroChart.update();
  } else {
    // First time → create the chart
    macroChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#3aaa6e', '#f9813a', '#5b9cf6'],
          borderColor:     ['#fff', '#fff', '#fff'],
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        cutout: '65%', // hollow center for doughnut look
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'DM Sans', size: 13 },
              padding: 16,
              usePointStyle: true,
            }
          },
          subtitle: {
            display: true,
            text: hasData ? 'Based on today\'s log' : 'Add food to see your breakdown',
            font: { family: 'DM Sans', size: 12 },
            color: '#888',
            padding: { bottom: 8 },
          }
        }
      }
    });
  }
}


/* ── 8. Main Render Function ──────────────
   Called every time data changes.
   Updates: summary cards, progress bar,
            nudge tip, food list, chart.   */
function render() {
  const t = getTotals(); // { cal, pro, car, fat }

  /* -- Summary cards -- */
  document.getElementById('tot-cal').textContent = Math.round(t.cal);
  document.getElementById('tot-pro').textContent = Math.round(t.pro);
  document.getElementById('tot-car').textContent = Math.round(t.car);
  document.getElementById('tot-fat').textContent = Math.round(t.fat);

  /* -- Progress bar -- */
  const pct = Math.min((t.cal / goal) * 100, 100); // cap at 100%
  const bar = document.getElementById('cal-bar');
  bar.style.width = pct.toFixed(1) + '%';

  // Change bar color based on how full it is
  bar.className = 'progress-fill' +
    (t.cal > goal * 1.1 ? ' over' :   // exceeded by 10%
     pct >= 85          ? ' warn' : ''); // near the goal

  document.getElementById('goal-pct').textContent =
    Math.round((t.cal / goal) * 100) + '%';

  /* -- Nudge tip -- */
  renderNudge(getNudges(t));

  /* -- Food log list -- */
  const list = document.getElementById('food-list');

  if (foods.length === 0) {
    list.innerHTML = '<div class="empty">No foods added yet. Start by adding a meal above!</div>';
  } else {
    list.innerHTML = foods.map(function(f) {
      return (
        '<div class="food-item">' +
          '<span class="food-name">' + f.name + '</span>' +
          '<span class="food-macros">' +
            '<span>' + Math.round(f.cal) + ' cal</span>' +
            '<span>' + Math.round(f.pro) + 'g P</span>'  +
            '<span>' + Math.round(f.car) + 'g C</span>'  +
            '<span>' + Math.round(f.fat) + 'g F</span>'  +
          '</span>' +
          '<button class="del" onclick="removeFood(' + f.id + ')" title="Remove">×</button>' +
        '</div>'
      );
    }).join('');
  }

  /* -- Chart -- */
  renderChart(t);
}


/* ── 9. Init ──────────────────────────────
   Run render once on page load so the
   chart appears even before any food is added. */
render();