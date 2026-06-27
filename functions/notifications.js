/**
 * ==========================================
 * ExamVerse AI
 * Notifications Backend
 * Part 1
 * ==========================================
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

const db = admin.firestore();


/* ==========================================
   Notification Status
========================================== */

exports.notificationStatus = onRequest(async (req, res) => {

  res.json({

    success: true,

    service: "Notification Module",

    version: "1.0.0",

    status: "Online"

  });

});


/* ==========================================
   Send Notification (User)
========================================== */

exports.sendUserNotification = onRequest(async (req, res) => {

  try {

    const {

      userId,

      title,

      body

    } = req.body;

    if (!userId || !title || !body) {

      return res.status(400).json({

        success: false,

        message: "Missing required fields"

      });

    }

    await db.collection("users")

      .doc(userId)

      .collection("notifications")

      .add({

        title,

        body,

        read: false,

        createdAt: admin.firestore.FieldValue.serverTimestamp()

      });

    res.json({

      success: true,

      message: "Notification sent to user"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Get User Notifications
========================================== */

exports.getUserNotifications = onRequest(async (req, res) => {

  try {

    const { userId } = req.query;

    if (!userId) {

      return res.status(400).json({

        success: false,

        message: "userId required"

      });

    }

    const snapshot = await db

      .collection("users")

      .doc(userId)

      .collection("notifications")

      .orderBy("createdAt", "desc")

      .limit(50)

      .get();

    const notifications = [];

    snapshot.forEach(doc => {

      notifications.push({

        id: doc.id,

        ...doc.data()

      });

    });

    res.json({

      success: true,

      notifications

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
/* ==========================================
   Mark Notification as Read
========================================== */

exports.markAsRead = onRequest(async (req, res) => {

  try {

    const { userId, notificationId } = req.body;

    if (!userId || !notificationId) {

      return res.status(400).json({

        success: false,

        message: "Missing fields"

      });

    }

    await db.collection("users")

      .doc(userId)

      .collection("notifications")

      .doc(notificationId)

      .update({

        read: true

      });

    res.json({

      success: true,

      message: "Marked as read"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Delete Notification
========================================== */

exports.deleteNotification = onRequest(async (req, res) => {

  try {

    const { userId, notificationId } = req.body;

    if (!userId || !notificationId) {

      return res.status(400).json({

        success: false,

        message: "Missing fields"

      });

    }

    await db.collection("users")

      .doc(userId)

      .collection("notifications")

      .doc(notificationId)

      .delete();

    res.json({

      success: true,

      message: "Notification deleted"

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Broadcast Notification (Admin)
========================================== */

exports.broadcastNotification = onRequest(async (req, res) => {

  try {

    const { title, body } = req.body;

    if (!title || !body) {

      return res.status(400).json({

        success: false,

        message: "Title and body required"

      });

    }

    const usersSnap = await db.collection("users").get();

    let count = 0;

    for (const user of usersSnap.docs) {

      await db.collection("users")

        .doc(user.id)

        .collection("notifications")

        .add({

          title,

          body,

          read: false,

          createdAt: admin.firestore.FieldValue.serverTimestamp()

        });

      count++;

    }

    res.json({

      success: true,

      sentToUsers: count

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


/* ==========================================
   Notification Analytics
========================================== */

exports.notificationAnalytics = onRequest(async (req, res) => {

  try {

    const usersSnap = await db.collection("users").get();

    let totalNotifications = 0;

    let unread = 0;

    for (const user of usersSnap.docs) {

      const notiSnap = await db.collection("users")

        .doc(user.id)

        .collection("notifications")

        .get();

      totalNotifications += notiSnap.size;

      notiSnap.forEach(doc => {

        if (!doc.data().read) {

          unread++;

        }

      });

    }

    res.json({

      success: true,

      totalNotifications,

      unread

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});
