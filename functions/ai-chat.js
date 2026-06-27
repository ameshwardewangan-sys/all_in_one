const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

/**
 * AI Chat Endpoint
 */
exports.chat = onRequest(async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required."
      });
    }

    logger.info("AI Chat Request", {
      userId: userId || "anonymous"
    });

    // Placeholder response
    res.status(200).json({
      success: true,
      reply: "AI Chat backend is ready. Connect your AI provider here.",
      timestamp: Date.now()
    });

  } catch (error) {
    logger.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
/**
 * ==========================================
 * ExamVerse AI
 * AI Chat Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

/* ==========================================
   Chat Health
========================================== */

exports.chatStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "ExamVerse AI Chat",

    version: "1.0.0",

    status: "Online"

  });

});


/* ==========================================
   Send Message
========================================== */

exports.sendMessage = onRequest(async (req, res) => {

  try {

    const {

      userId,

      message

    } = req.body;

    if (!userId || !message) {

      return res.status(400).json({

        success: false,

        message: "Missing required fields."

      });

    }

    await db.collection("chat_messages").add({

      userId,

      message,

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      reply: "Message received successfully."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get Chat Messages
========================================== */

exports.getMessages = onRequest(async (req, res) => {

  try {

    const userId = req.query.userId;

    const snapshot = await db

      .collection("chat_messages")

      .where("userId", "==", userId)

      .orderBy("createdAt", "desc")

      .limit(100)

      .get();

    const messages = [];

    snapshot.forEach(doc => {

      messages.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      messages

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
