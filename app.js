//////////////////////////////////////////////////////
// ExamVerse AI - Core Engine
//////////////////////////////////////////////////////

// ================= USER DATA =================
let user = {
  name: "Guest",
  coins: 0,
  xp: 0,
  level: 1,
  selectedExams: [],
};

// ================= WEATHER API =================
// (OpenWeather example - replace API key later)
const WEATHER_API_KEY = "YOUR_API_KEY_HERE";

async function getCityWeather(city) {
  try {
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );
    let data = await res.json();

    return {
      city: data.name,
      temp: data.main.temp,
      condition: data.weather[0].main,
      humidity: data.main.humidity,
    };
  } catch (err) {
    console.log("Weather Error:", err);
  }
}

// ================= MOCK QUESTION ENGINE =================
const questions = [
  {
    q: "Who is the Prime Minister of India?",
    options: ["Modi", "Gandhi", "Kejriwal", "Yogi"],
    answer: 0,
  },
  {
    q: "Capital of India?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    answer: 1,
  },
];

let currentQ = 0;

function loadQuestion() {
  let q = questions[currentQ];
  console.log("Q:", q.q);
}

// ================= SCORE SYSTEM =================
function correctAnswer() {
  user.coins += 10;
  user.xp += 20;

  if (user.xp >= 100) {
    user.level++;
    user.xp = 0;
  }

  saveUser();
}

function wrongAnswer() {
  user.xp += 2;
  saveUser();
}

// ================= LOCAL STORAGE =================
function saveUser() {
  localStorage.setItem("examverse_user", JSON.stringify(user));
}

function loadUser() {
  let data = localStorage.getItem("examverse_user");
  if (data) {
    user = JSON.parse(data);
  }
}

// ================= APPLY SYSTEM =================
function openApplyLink(url) {
  window.open(url, "_blank");
}

// ================= INITIALIZE APP =================
function initApp() {
  loadUser();
  console.log("ExamVerse AI Loaded 🚀");
}

initApp();
