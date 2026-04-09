const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");
const noteInput = document.getElementById("noteInput");
const noteTitle = document.getElementById("noteTitle");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();
let startDate = null;
let endDate = null;
let selectedDay = null;

let notes = JSON.parse(localStorage.getItem("notes")) || {};

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function generateCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.innerText = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  daysContainer.innerHTML = "";

  const holidays = {
  "1-1": "New Year",
  "1-26": "Republic Day",
  "8-15": "Independence Day",
};

  // empty spaces
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    daysContainer.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const div = document.createElement("div");
    div.classList.add("day");
    div.innerText = day;

    div.onclick = () => handleClick(day);

    // TODAY highlight
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      div.classList.add("today");
    }

    // RANGE styles
    if (day === startDate) div.classList.add("start");
    if (day === endDate) div.classList.add("end");

    if (startDate && endDate && day > startDate && day < endDate) {
      div.classList.add("in-range");
    }

    daysContainer.appendChild(div);
  }

  const key = `${month + 1}-${day}`;
if (holidays[key]) {
  div.style.border = "2px solid red";
  div.title = holidays[key];
}
}

// click logic
function handleClick(day) {
  selectedDay = day;
  noteTitle.innerText = `Notes for Day ${day}`;

  if (!startDate) {
    startDate = day;
  } else if (!endDate) {
    endDate = day;
  } else {
    startDate = day;
    endDate = null;
  }

  noteInput.value = notes[day] || "";

  generateCalendar();
}

// notes
noteInput.addEventListener("input", () => {
  if (selectedDay) {
    notes[selectedDay] = noteInput.value;
    localStorage.setItem("notes", JSON.stringify(notes));
  }
});

// month navigation
prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  startDate = null;
  endDate = null;
  generateCalendar();
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  startDate = null;
  endDate = null;
  generateCalendar();
};

generateCalendar();

function animateChange(callback) {
  daysContainer.classList.add("fade-out");

  setTimeout(() => {
    callback();
    daysContainer.classList.remove("fade-out");
    daysContainer.classList.add("fade-in");
  }, 200);

  setTimeout(() => {
    daysContainer.classList.remove("fade-in");
  }, 400);
}

prevBtn.onclick = () => {
  animateChange(() => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    startDate = null;
    endDate = null;
    generateCalendar();
  });
};

nextBtn.onclick = () => {
  animateChange(() => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    startDate = null;
    endDate = null;
    generateCalendar();
  });
};

const colors = ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6"];

function changeTheme() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.documentElement.style.setProperty("--theme-color", randomColor);
}

// call on month change
prevBtn.onclick = () => {
  animateChange(() => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    changeTheme();
    generateCalendar();
  });
};

nextBtn.onclick = () => {
  animateChange(() => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    changeTheme();
    generateCalendar();
  });
};


document.getElementById("export").onclick = () => {
  const dataStr = JSON.stringify(notes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "notes.json";
  a.click();
};