const aiTutor = require("./ai-tutor");

exports.askAI = aiTutor.askAI;
exports.generateQuiz = aiTutor.generateQuiz;
exports.evaluateAnswer = aiTutor.evaluateAnswer;
exports.generateSummary = aiTutor.generateSummary;
/**
 * ==========================================
 * ExamVerse AI
 * AI Tutor Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

/* ==========================================
   AI Tutor Health
========================================== */

exports.askAI = onRequest(async (req, res) => {

  try {

    const { question, userId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required."
      });
    }

    await db.collection("ai_logs").add({

      userId: userId || "guest",

      question,

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      message: "AI Tutor endpoint ready.",

      answer: "AI integration will be connected here."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Quiz Generator
========================================== */

exports.generateQuiz = onRequest(async (req, res) => {

  res.json({

    success: true,

    message: "Quiz Generator Ready"

  });

});


/* ==========================================
   Answer Evaluation
========================================== */

exports.evaluateAnswer = onRequest(async (req, res) => {

  res.json({

    success: true,

    message: "Answer Evaluation Ready"

  });

});


/* ==========================================
   Summary Generator
========================================== */

exports.generateSummary = onRequest(async (req, res) => {

  res.json({

    success: true,

    message: "Summary Generator Ready"

  });

});
/* ==========================================
   Save AI Conversation
========================================== */

exports.saveConversation = onRequest(async (req, res) => {

  try {

    const { userId, question, answer } = req.body;

    if (!userId || !question || !answer) {

      return res.status(400).json({

        success: false,

        message: "Missing required fields."

      });

    }

    await db.collection("users")
      .doc(userId)
      .collection("ai_history")
      .add({

        question,

        answer,

        createdAt: admin.firestore.FieldValue.serverTimestamp()

      });

    res.json({

      success: true,

      message: "Conversation saved successfully."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get AI History
========================================== */

exports.getHistory = onRequest(async (req, res) => {

  try {

    const userId = req.query.userId;

    if (!userId) {

      return res.status(400).json({

        success: false,

        message: "User ID is required."

      });

    }

    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("ai_history")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const history = [];

    snapshot.forEach(doc => {

      history.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      history

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Delete AI History
========================================== */

exports.clearHistory = onRequest(async (req, res) => {

  res.json({

    success: true,

    message: "Clear history endpoint ready."

  });

});
/* ==========================================
   AI Tutor Part 3
   Usage Analytics & Health
========================================== */

/* Save AI Usage */

exports.logAIUsage = onRequest(async (req, res) => {

  try {

    const { userId, feature } = req.body;

    await db.collection("ai_usage").add({

      userId: userId || "guest",

      feature: feature || "ai_tutor",

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


/* AI Status */

exports.aiStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "ExamVerse AI Tutor",

    version: "1.0.0",

    status: "Online",

    timestamp: Date.now()

  });

});


/* AI Configuration */

exports.getAIConfig = onRequest(async (req, res) => {

  res.json({

    success: true,

    config: {

      maxQuestionsPerDay: 500,

      maxQuizQuestions: 100,

      supportedLanguages: [

        "English",

        "Hindi"

      ],

      aiModel: "Gemini"

    }

  });

});


/* ==========================================
   End of AI Tutor Module
========================================== */
