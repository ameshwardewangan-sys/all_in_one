/**
 * ==========================================
 * ExamVerse AI Tutor
 * Production Ready Backend
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();


/* ==========================================
   AI ASK FUNCTION (MAIN BRAIN)
========================================== */

exports.askAI = onRequest(async (req, res) => {

  try {

    const { question, mode, userId } = req.body;

    if (!question) {

      return res.status(400).json({

        success: false,

        message: "Question is required"

      });

    }

    /* ==========================================
       MODE SYSTEM (EXAM SPECIALIZATION)
    ========================================== */

    let systemPrompt = "";

    if (mode === "ssc") {
      systemPrompt = "You are SSC exam expert. Give short and accurate answers.";
    } 
    else if (mode === "railway") {
      systemPrompt = "You are Railway exam coach. Focus on GK and reasoning.";
    } 
    else if (mode === "banking") {
      systemPrompt = "You are Banking exam mentor. Focus on finance and aptitude.";
    } 
    else if (mode === "hindi") {
      systemPrompt = "Always answer in simple Hindi.";
    } 
    else {
      systemPrompt = "You are ExamVerse AI tutor for all exams. Explain clearly and simply.";
    }


    /* ==========================================
       FAKE AI RESPONSE (Replace later with Gemini/OpenAI)
    ========================================== */

    const API_KEY = "YOUR_GEMINI_API_KEY";

const prompt = `${systemPrompt}\n\nUser Question: ${question}`;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    })
  }
);

const data = await response.json();

const aiResponse =
  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
  "AI not responding";

    /* ==========================================
       SAVE USAGE LOG
    ========================================== */

    await db.collection("ai_usage").add({

      userId: userId || "guest",

      question,

      mode: mode || "general",

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });


    res.json({

      success: true,

      answer: aiResponse,

      systemPrompt

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   AI USAGE LOG (Optional endpoint)
========================================== */

exports.logAIUsage = onRequest(async (req, res) => {

  try {

    const { userId, question, mode } = req.body;

    await db.collection("ai_usage").add({

      userId: userId || "guest",

      question: question || "",

      mode: mode || "general",

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      message: "Usage logged successfully."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   AI STATUS
========================================== */

exports.aiStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "ExamVerse AI Tutor",

    version: "1.0.0",

    status: "Online",

    timestamp: Date.now()

  });

});


/* ==========================================
   AI CONFIG
========================================== */

exports.getAIConfig = onRequest(async (req, res) => {

  res.json({

    success: true,

    config: {

      maxQuestionsPerDay: 500,

      maxQuizQuestions: 100,

      supportedLanguages: ["English", "Hindi"],

      aiModel: "Gemini (Ready to integrate)"

    }

  });

});
