//////////////////////////////////////////////////////
// ExamVerse AI - Core Engine
//////////////////////////////////////////////////////

// ================= USER DATA =================
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  getFirestore
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "examverse-ai-india",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
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
const BASE_URL = "https://us-central1-examverse-ai-india.cloudfunctions.net";
export async function askAI(question, userId) {

  const res = await fetch(`${BASE_URL}/askAI`, {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ question, userId })

  });

  return await res.json();
}
export async function getMockTests() {

  const res = await fetch(`${BASE_URL}/getMockTests`);

  return await res.json();
}
export async function uploadOCR(userId, fileName) {

  const res = await fetch(`${BASE_URL}/uploadOCR`, {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ userId, fileName })

  });

  return await res.json();
}
export async function speechToText(userId, audioFile) {

  const res = await fetch(`${BASE_URL}/speechToText`, {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ userId, audioFile })

  });

  return await res.json();
}
export async function getCurrentAffairs() {

  const res = await fetch(`${BASE_URL}/getCurrentAffairs`);

  return await res.json();
}
export async function getNotifications(userId) {

  const res = await fetch(`${BASE_URL}/getUserNotifications?userId=${userId}`);

  return await res.json();
}
