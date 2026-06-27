/**
 * ==========================================
 * ExamVerse AI
 * AI OCR Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();

/* ==========================================
   OCR Health
========================================== */

exports.ocrStatus = onRequest(async (req, res) => {

  res.json({
    success: true,
    service: "ExamVerse AI OCR",
    version: "1.0.0",
    status: "Online"
  });

});


/* ==========================================
   Upload OCR Job
========================================== */

exports.uploadOCR = onRequest(async (req, res) => {

  try {

    const { userId, fileName } = req.body;

    await db.collection("ocr_jobs").add({

      userId,

      fileName,

      status: "pending",

      createdAt: admin.firestore.FieldValue.serverTimestamp()

    });

    res.json({

      success: true,

      message: "OCR job created successfully."

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get OCR Jobs
========================================== */

exports.getOCRJobs = onRequest(async (req, res) => {

  try {

    const snapshot = await db
      .collection("ocr_jobs")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const jobs = [];

    snapshot.forEach(doc => {

      jobs.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      jobs

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
