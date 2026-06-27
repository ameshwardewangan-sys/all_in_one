users/
  userId/
    name
    email
    coins
    xp
    level
    selectedExams
    progress
    lastActive

questions/
  examId/
    questionId/
      question
      options
      answer
      explanation

vacancies/
  vacancyId/
    title
    applyLink
    lastDate
    state
    examType

weather_cache/
  city/
    temp
    condition
    updatedAt

analytics/
  totalUsers
  activeUsers
  downloads
/* =====================================================
   ExamVerse AI
   Firebase Production Extension
   Part 1
===================================================== */

/* -------------------------
   Firebase Services
-------------------------- */

import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    EmailAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    getFirestore,
    serverTimestamp,
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";


/* -------------------------
   Initialize Services
-------------------------- */

export const auth = getAuth(app);

export const firestore = getFirestore(app);

export const realtimeDB = getDatabase(app);

export const storage = getStorage(app);


/* -------------------------
   Providers
-------------------------- */

export const googleProvider = new GoogleAuthProvider();

export const githubProvider = new GithubAuthProvider();


/* -------------------------
   Login
-------------------------- */

export async function loginWithGoogle() {

    return await signInWithPopup(
        auth,
        googleProvider
    );

}

export async function loginWithGithub() {

    return await signInWithPopup(
        auth,
        githubProvider
    );

}


/* -------------------------
   Logout
-------------------------- */

export async function logoutUser() {

    await signOut(auth);

}


/* -------------------------
   Auth Listener
-------------------------- */

export function observeAuth(callback) {

    onAuthStateChanged(auth, callback);

}


/* -------------------------
   User Profile
-------------------------- */

export async function createUserProfile(user) {

    if (!user) return;

    const ref = doc(
        firestore,
        "users",
        user.uid
    );

    const snap = await getDoc(ref);

    if (snap.exists()) return;

    await setDoc(ref, {

        uid: user.uid,

        name: user.displayName || "",

        email: user.email || "",

        photo: user.photoURL || "",

        role: "student",

        premium: false,

        coins: 0,

        xp: 0,

        streak: 0,

        createdAt: serverTimestamp(),

        lastLogin: serverTimestamp()

    });

}
/* =====================================================
   ExamVerse AI
   Firebase Production Extension
   Part 2
===================================================== */

import {
    getDocs,
    query,
    where,
    orderBy,
    limit,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


/* -------------------------
   User Roles
-------------------------- */

export const USER_ROLES = {

    OWNER: "owner",

    SUPER_ADMIN: "super_admin",

    ADMIN: "admin",

    MODERATOR: "moderator",

    STUDENT: "student"

};


/* -------------------------
   Get User Role
-------------------------- */

export async function getUserRole(uid) {

    const ref = doc(firestore, "users", uid);

    const snap = await getDoc(ref);

    if (!snap.exists()) return USER_ROLES.STUDENT;

    return snap.data().role || USER_ROLES.STUDENT;

}


/* -------------------------
   Permission Check
-------------------------- */

export async function hasPermission(uid, roles = []) {

    const role = await getUserRole(uid);

    return roles.includes(role);

}


/* -------------------------
   Save Current Affairs
-------------------------- */

export async function saveCurrentAffair(data) {

    return await addDoc(

        collection(firestore, "current_affairs"),

        {

            ...data,

            createdAt: serverTimestamp()

        }

    );

}


/* -------------------------
   Save Mock Test
-------------------------- */

export async function saveMockTest(test) {

    return await addDoc(

        collection(firestore, "mock_tests"),

        {

            ...test,

            createdAt: serverTimestamp()

        }

    );

}


/* -------------------------
   Save AI Chat
-------------------------- */

export async function saveChat(uid, message) {

    return await addDoc(

        collection(

            firestore,

            "users",

            uid,

            "chat_history"

        ),

        {

            ...message,

            createdAt: serverTimestamp()

        }

    );

}


/* -------------------------
   Activity Log
-------------------------- */

export async function logActivity(uid, action) {

    return await addDoc(

        collection(

            firestore,

            "activity_logs"

        ),

        {

            uid,

            action,

            time: serverTimestamp()

        }

    );

}


/* -------------------------
   Notification
-------------------------- */

export async function createNotification(uid, title, body) {

    return await addDoc(

        collection(

            firestore,

            "users",

            uid,

            "notifications"

        ),

        {

            title,

            body,

            read: false,

            createdAt: serverTimestamp()

        }

    );

}


/* -------------------------
   Generic CRUD Helpers
-------------------------- */

export async function getCollection(name) {

    const snapshot = await getDocs(

        collection(

            firestore,

            name

        )

    );

    return snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

    }));

}


export async function updateCollection(

    collectionName,

    documentId,

    data

) {

    return await updateDoc(

        doc(

            firestore,

            collectionName,

            documentId

        ),

        data

    );

}


export async function deleteCollection(

    collectionName,

    documentId

) {

    return await deleteDoc(

        doc(

            firestore,

            collectionName,

            documentId

        )

    );

}
/* =====================================================
   ExamVerse AI
   Firebase Production Extension
   Part 3 (Final)
===================================================== */

import {
    getAnalytics,
    isSupported
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";

import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging.js";


/* -------------------------
   Analytics
-------------------------- */

export let analytics = null;

export async function initializeAnalytics() {

    if (await isSupported()) {

        analytics = getAnalytics(app);

    }

}


/* -------------------------
   Cloud Messaging
-------------------------- */

export let messaging = null;

export async function initializeMessaging(vapidKey) {

    try {

        messaging = getMessaging(app);

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {

            return null;

        }

        const token = await getToken(

            messaging,

            {

                vapidKey

            }

        );

        return token;

    } catch (error) {

        console.error("FCM Error:", error);

        return null;

    }

}


/* -------------------------
   Foreground Notifications
-------------------------- */

export function listenForMessages(callback) {

    if (!messaging) return;

    onMessage(

        messaging,

        (payload) => {

            console.log("Notification:", payload);

            callback(payload);

        }

    );

}


/* -------------------------
   User Last Login
-------------------------- */

export async function updateLastLogin(uid) {

    await updateDoc(

        doc(

            firestore,

            "users",

            uid

        ),

        {

            lastLogin: serverTimestamp()

        }

    );

}


/* -------------------------
   Daily Streak
-------------------------- */

export async function updateDailyStreak(uid, streak) {

    await updateDoc(

        doc(

            firestore,

            "users",

            uid

        ),

        {

            streak

        }

    );

}


/* -------------------------
   Offline Persistence Flag
-------------------------- */

export const OFFLINE_ENABLED = true;


/* -------------------------
   Firebase Bootstrap
-------------------------- */

export async function initializeFirebase() {

    await initializeAnalytics();

    console.log("Firebase Initialized");

}


/* -------------------------
   App Health
-------------------------- */

export function getFirebaseStatus() {

    return {

        auth: !!auth,

        firestore: !!firestore,

        realtimeDB: !!realtimeDB,

        storage: !!storage,

        analytics: !!analytics,

        messaging: !!messaging,

        offline: OFFLINE_ENABLED

    };

}


/* -------------------------
   Export Bundle
-------------------------- */

export default {

    auth,

    firestore,

    realtimeDB,

    storage,

    analytics,

    messaging,

    initializeFirebase,

    loginWithGoogle,

    loginWithGithub,

    logoutUser,

    observeAuth,

    createUserProfile,

    getUserRole,

    hasPermission,

    saveCurrentAffair,

    saveMockTest,

    saveChat,

    logActivity,

    createNotification,

    getCollection,

    updateCollection,

    deleteCollection,

    updateLastLogin,

    updateDailyStreak,

    getFirebaseStatus

};


/* =====================================================
   END OF FIREBASE.JS
===================================================== */
