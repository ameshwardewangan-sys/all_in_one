/**
 * ==========================================
 * ExamVerse AI
 * Mock Test Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

/* ==========================================
   Mock Test Status
========================================== */

exports.mockStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "ExamVerse Mock Tests",

    version: "1.0.0",

    status: "Online"

  });

});


/* ==========================================
   Create Mock Test
========================================== */

exports.createMockTest = onRequest(async (req, res) => {

  try {

    const {

      title,

      exam,

      questions

    } = req.body;

    const docRef = await db.collection("mock_tests").add({

      title,

      exam,

      questions,

      totalQuestions: questions ? questions.length : 0,

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      testId: docRef.id

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get Mock Tests
========================================== */

exports.getMockTests = onRequest(async (req, res) => {

  try {

    const snapshot = await db

      .collection("mock_tests")

      .orderBy("createdAt", "desc")

      .limit(50)

      .get();

    const tests = [];

    snapshot.forEach(doc => {

      tests.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      tests

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
/* ==========================================
   Submit Mock Test
========================================== */

exports.submitMockTest = onRequest(async (req, res) => {

  try {

    const {

      userId,

      testId,

      answers,

      score

    } = req.body;

    const resultRef = await db.collection("mock_results").add({

      userId,

      testId,

      answers: answers || [],

      score: score || 0,

      submittedAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      resultId: resultRef.id,

      score: score || 0

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Result History
========================================== */

exports.getMockResults = onRequest(async (req, res) => {

  try {

    const { userId } = req.query;

    const snapshot = await db

      .collection("mock_results")

      .where("userId", "==", userId)

      .orderBy("submittedAt", "desc")

      .limit(100)

      .get();

    const results = [];

    snapshot.forEach(doc => {

      results.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      results

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Leaderboard
========================================== */

exports.getLeaderboard = onRequest(async (req, res) => {

  try {

    const snapshot = await db

      .collection("mock_results")

      .orderBy("score", "desc")

      .limit(50)

      .get();

    const leaderboard = [];

    snapshot.forEach(doc => {

      leaderboard.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      leaderboard

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
/* ==========================================
   Auto Evaluation (Basic Engine)
========================================== */

exports.evaluateMockTest = onRequest(async (req, res) => {

  try {

    const {

      answers,

      correctAnswers

    } = req.body;

    if (!answers || !correctAnswers) {

      return res.status(400).json({

        success: false,

        message: "Answers and correctAnswers required."

      });

    }

    let score = 0;

    let total = correctAnswers.length;

    for (let i = 0; i < total; i++) {

      if (answers[i] === correctAnswers[i]) {

        score++;

      }

    }

    res.json({

      success: true,

      score,

      total,

      percentage: (score / total) * 100

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Mock Test Analytics
========================================== */

exports.mockAnalytics = onRequest(async (req, res) => {

  try {

    const testsSnap = await db.collection("mock_tests").get();

    const resultsSnap = await db.collection("mock_results").get();

    res.json({

      success: true,

      totalTests: testsSnap.size,

      totalAttempts: resultsSnap.size

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Delete Mock Test
========================================== */

exports.deleteMockTest = onRequest(async (req, res) => {

  try {

    const { testId } = req.body;

    if (!testId) {

      return res.status(400).json({

        success: false,

        message: "testId required"

      });

    }

    await db.collection("mock_tests").doc(testId).delete();

    res.json({

      success: true,

      message: "Mock test deleted"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Mock Health Check
========================================== */

exports.mockHealth = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "Mock Test Engine",

    status: "Healthy",

    timestamp: Date.now()

  });

});


/* ==========================================
   End Mock Tests Module
========================================== */
