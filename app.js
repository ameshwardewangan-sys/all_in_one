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
  apiKey: "AQ.Ab8RN6KeHiqqpqu6_oFx0zrNrpiI9_AdFACSMWMXi926M63EiA",
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
const WEATHER_API_KEY = "AQ.Ab8RN6KeHiqqpqu6_oFx0zrNrpiI9_AdFACSMWMXi926M63EiA";

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
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./app.js";


window.loginUser = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(auth, email, password);

    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

  } catch (error) {

    alert(error.message);

  }

};


window.registerUser = async function () {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    await createUserWithEmailAndPassword(auth, email, password);

    alert("Registered Successfully!");

  } catch (error) {

    alert(error.message);

  }

};
window.openAI = () => alert("AI Tutor Coming Soon UI");
window.openMockTests = () => alert("Mock Tests UI Coming Soon");
window.openOCR = () => alert("OCR UI Coming Soon");
window.openVoice = () => alert("Voice UI Coming Soon");
window.openCurrentAffairs = () => alert("Current Affairs UI Coming Soon");
window.openNotifications = () => alert("Notifications UI Coming Soon");
/* =========================
   OPEN CHAT SCREEN
========================= */

window.openAIChat = function () {

  document.getElementById("dashboard").style.display = "none";
  document.getElementById("aiChatScreen").style.display = "flex";

};


window.sendMessage = async function () {

  const msg = document.getElementById("userMsg").value;
  if (!msg) return;

  const chatBox = document.getElementById("chatBox");

  // USER MESSAGE
  chatBox.innerHTML += `
  <div class="aiMsg">
    <span>🤖 ${reply}</span>
  </div>
`;
  chatBox.innerHTML += `
    <div style="text-align:right;margin:5px;">
      <span style="background:#2563eb;color:white;padding:8px;border-radius:10px;display:inline-block;">
        ${msg}
      </span>
    </div>
  `;
const speech = new SpeechSynthesisUtterance(reply);
speech.lang = "en-IN";
speech.rate = 1;
window.speechSynthesis.speak(speech);
  document.getElementById("userMsg").value = "";

  chatBox.scrollTop = chatBox.scrollHeight;

  try {

    // 🔥 CALL FIREBASE FUNCTION (REAL AI)
    const res = await fetch(`${BASE_URL}/askAI`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
  question: msg,
  userId: "demo-user",
  mode: currentMode
      })

    });

    const data = await res.json();

    const reply = data.answer || "No response from AI";

    // AI MESSAGE
    chatBox.innerHTML += `
      <div style="text-align:left;margin:5px;">
        <span style="background:#e2e8f0;padding:8px;border-radius:10px;display:inline-block;">
          🤖 ${reply}
        </span>
      </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {

    chatBox.innerHTML += `
      <div style="text-align:left;margin:5px;">
        <span style="background:red;color:white;padding:8px;border-radius:10px;display:inline-block;">
          Error: AI not responding
        </span>
      </div>
    `;
let currentMode = "general"; // general | ssc | railway | banking | hindi
window.setMode = function(mode) {

  currentMode = mode;

  alert("Mode changed to: " + mode);

};
  }

};

  // AI RESPONSE (temporary)
  setTimeout(() => {

    chatBox.innerHTML += `
      <div style="text-align:left;margin:5px;">
        <span style="background:#e2e8f0;padding:8px;border-radius:10px;display:inline-block;">
          AI: I'm ExamVerse AI, backend connect pending 🚀
        </span>
      </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

  }, 800);

};
window.startVoice = function () {

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support Voice AI");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN"; // Hindi + English support
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = function (event) {

    const voiceText = event.results[0][0].transcript;

    document.getElementById("userMsg").value = voiceText;

  };

};
