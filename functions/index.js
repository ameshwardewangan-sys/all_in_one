/**
 * ExamVerse AI
 * Cloud Functions
 * Production Base
 */
const mockTests = require("./mock-tests");
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
exports.submitMockTest = mockTests.submitMockTest;
exports.getMockResults = mockTests.getMockResults;
exports.getLeaderboard = mockTests.getLeaderboard;
exports.evaluateMockTest = mockTests.evaluateMockTest;
exports.mockAnalytics = mockTests.mockAnalytics;
exports.deleteMockTest = mockTests.deleteMockTest;
exports.mockHealth = mockTests.mockHealth;
const currentAffairs = require("./current-affairs");
‎
‎exports.currentAffairsStatus = currentAffairs.currentAffairsStatus;
‎exports.addCurrentAffair = currentAffairs.addCurrentAffair;
‎exports.getCurrentAffairs = currentAffairs.getCurrentAffairs;
‎exports.deleteCurrentAffair = currentAffairs.deleteCurrentAffair;
‎exports.getByCategory = currentAffairs.getByCategory;
‎exports.searchCurrentAffairs = currentAffairs.searchCurrentAffairs;
‎exports.currentAffairsAnalytics = currentAffairs.currentAffairsAnalytics;
‎const notifications = require("./notifications");
‎
‎exports.notificationStatus = notifications.notificationStatus;
‎exports.sendUserNotification = notifications.sendUserNotification;
‎exports.getUserNotifications = notifications.getUserNotifications;
‎exports.markAsRead = notifications.markAsRead;
‎exports.deleteNotification = notifications.deleteNotification;
‎exports.broadcastNotification = notifications.broadcastNotification;
‎exports.notificationAnalytics = notifications.notificationAnalytics;
‎const adminModule = require("./admin");
‎
‎exports.adminStatus = adminModule.adminStatus;
‎exports.createAdmin = adminModule.createAdmin;
‎exports.getAdminRole = adminModule.getAdminRole;
‎exports.toggleUserBan = adminModule.toggleUserBan;
‎exports.deleteContent = adminModule.deleteContent;
‎exports.getSystemLogs = adminModule.getSystemLogs;
‎exports.addSystemLog = adminModule.addSystemLog;
‎const ownerModule = require("./owner");
‎
‎exports.ownerStatus = ownerModule.ownerStatus;
‎exports.getPlatformStats = ownerModule.getPlatformStats;
‎exports.getAllUsers = ownerModule.getAllUsers;
‎exports.deleteUser = ownerModule.deleteUser;
‎exports.aiUsageAnalytics = ownerModule.aiUsageAnalytics;
‎exports.toggleFeature = ownerModule.toggleFeature;
‎exports.resetSystem = ownerModule.resetSystem;
‎
