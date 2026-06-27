const ai = require("./ai");
exports.askAI = ai.askAI;
exports.generateQuiz = ai.generateQuiz;
exports.evaluateAnswer = ai.evaluateAnswer;
exports.generateSummary = ai.generateSummary;
const { onRequest } = require("firebase-functions/v2/https");

exports.askAI = onRequest(async (req, res) => {
  res.json({
    success: true,
    message: "AI endpoint is ready.",
    data: null
  });
});

exports.generateQuiz = onRequest(async (req, res) => {
  res.json({
    success: true,
    message: "Quiz generator endpoint is ready."
  });
});

exports.evaluateAnswer = onRequest(async (req, res) => {
  res.json({
    success: true,
    message: "Answer evaluation endpoint is ready."
  });
});

exports.generateSummary = onRequest(async (req, res) => {
  res.json({
    success: true,
    message: "Summary generator endpoint is ready."
  });
});
