/**
 * ExamVerse AI
 * Cloud Functions
 * Production Base
 */
const aiVoice = require("./ai-voice");
const aiOCR = require("./ai-ocr");
const aiChat = require("./ai-chat");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

/* ==========================================
   Health Check
========================================== */

exports.health = onRequest((req, res) => {

  logger.info("Health endpoint called");

  res.status(200).json({
    success: true,
    app: "ExamVerse AI",
    version: "1.0.0",
    status: "Running",
    timestamp: new Date().toISOString()
  });

});


/* ==========================================
   Server Time
========================================== */

exports.serverTime = onRequest((req, res) => {

  res.json({
    serverTime: Date.now()
  });

});


/* ==========================================
   Send Notification (Base)
========================================== */

exports.sendNotification = onRequest(async (req, res) => {

  try {

    const {

      token,
      title,
      body

    } = req.body;

    await admin.messaging().send({

      token,

      notification: {

        title,

        body

      }

    });

    res.json({

      success: true

    });

  } catch (error) {

    logger.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
exports.logAIUsage = aiTutor.logAIUsage;
exports.aiStatus = aiTutor.aiStatus;
exports.getAIConfig = aiTutor.getAIConfig;
exports.clearChatHistory = aiChat.clearChatHistory;
exports.updateTypingStatus = aiChat.updateTypingStatus;
exports.markMessagesRead = aiChat.markMessagesRead;
exports.getConversation = aiChat.getConversation;
exports.checkRateLimit = aiChat.checkRateLimit;
exports.chatAnalytics = aiChat.chatAnalytics;
exports.getConversationSummary = aiChat.getConversationSummary;
exports.moderateMessage = aiChat.moderateMessage;
exports.chatConfig = aiChat.chatConfig;
exports.ocrStatus = aiOCR.ocrStatus;
exports.uploadOCR = aiOCR.uploadOCR;
exports.getOCRJobs = aiOCR.getOCRJobs;
exports.saveOCRResult = aiOCR.saveOCRResult;
exports.getOCRHistory = aiOCR.getOCRHistory;
exports.deleteOCRJob = aiOCR.deleteOCRJob;
exports.ocrAnalytics = aiOCR.ocrAnalytics;
exports.getOCRConfig = aiOCR.getOCRConfig;
exports.validateOCRImage = aiOCR.validateOCRImage;
exports.generateNotesFromOCR = aiOCR.generateNotesFromOCR;
exports.ocrHealth = aiOCR.ocrHealth;
exports.voiceStatus = aiVoice.voiceStatus;
exports.speechToText = aiVoice.speechToText;
exports.textToSpeech = aiVoice.textToSpeech;
exports.voiceQuiz = aiVoice.voiceQuiz;
exports.voiceCommand = aiVoice.voiceCommand;
exports.getVoiceHistory = aiVoice.getVoiceHistory;
exports.deleteVoiceJob = aiVoice.deleteVoiceJob;
exports.voiceAnalytics = aiVoice.voiceAnalytics;
exports.getVoiceConfig = aiVoice.getVoiceConfig;
exports.checkPronunciation = aiVoice.checkPronunciation;
exports.voiceAssistant = aiVoice.voiceAssistant;
exports.voiceHealth = aiVoice.voiceHealth;
