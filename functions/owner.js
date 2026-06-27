/**
 * ==========================================
 * ExamVerse AI
 * Owner Backend System
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();


/* ==========================================
   Owner Status
========================================== */

exports.ownerStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "Owner System",

    version: "1.0.0",

    status: "Online"

  });

});


/* ==========================================
   Platform Overview Stats
========================================== */

exports.getPlatformStats = onRequest(async (req, res) => {

  try {

    const usersSnap = await db.collection("users").get();

    const aiSnap = await db.collection("ai_usage").get();

    const mockSnap = await db.collection("mock_results").get();

    const ocrSnap = await db.collection("ocr_jobs").get();

    const voiceSnap = await db.collection("voice_jobs").get();

    res.json({

      success: true,

      stats: {

        totalUsers: usersSnap.size,

        totalAIUsage: aiSnap.size,

        totalMockAttempts: mockSnap.size,

        totalOCRJobs: ocrSnap.size,

        totalVoiceJobs: voiceSnap.size

      }

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get All Users (Owner)
========================================== */

exports.getAllUsers = onRequest(async (req, res) => {

  try {

    const snapshot = await db.collection("users")

      .orderBy("createdAt", "desc")

      .limit(100)

      .get();

    const users = [];

    snapshot.forEach(doc => {

      users.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      users

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
/* ==========================================
   Delete User (Owner Power)
========================================== */

exports.deleteUser = onRequest(async (req, res) => {

  try {

    const { userId } = req.body;

    if (!userId) {

      return res.status(400).json({

        success: false,

        message: "userId required"

      });

    }

    await db.collection("users").doc(userId).delete();

    res.json({

      success: true,

      message: "User deleted successfully"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   AI Usage Analytics (Advanced)
========================================== */

exports.aiUsageAnalytics = onRequest(async (req, res) => {

  try {

    const snapshot = await db.collection("ai_usage").get();

    const usageMap = {};

    snapshot.forEach(doc => {

      const feature = doc.data().feature || "unknown";

      usageMap[feature] = (usageMap[feature] || 0) + 1;

    });

    res.json({

      success: true,

      totalUsage: snapshot.size,

      breakdown: usageMap

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   System Feature Toggle
========================================== */

exports.toggleFeature = onRequest(async (req, res) => {

  try {

    const { featureName, enabled } = req.body;

    if (!featureName) {

      return res.status(400).json({

        success: false,

        message: "featureName required"

      });

    }

    await db.collection("system_settings").doc(featureName).set({

      enabled: enabled === true

    });

    res.json({

      success: true,

      message: "Feature updated"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   System Reset (Danger Action)
========================================== */

exports.resetSystem = onRequest(async (req, res) => {

  res.json({

    success: true,

    message: "System reset endpoint ready (protected action)"

  });

});
