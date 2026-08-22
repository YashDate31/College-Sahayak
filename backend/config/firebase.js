const { initializeApp, getApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const fs = require('fs');
const path = require('path');

let isInitialized = false;
let authInstance = null;

try {
  const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);

    // Only initialize once (prevent duplicate app error on hot reload)
    const app = getApps().length === 0
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApp();

    authInstance = getAuth(app);
    isInitialized = true;
    console.log('Firebase Admin SDK initialized successfully via serviceAccountKey.json');
  } else {
    console.warn('WARNING: serviceAccountKey.json not found. Firebase Auth will not work.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

// Export an admin-compatible object so existing code (admin.auth()) still works
const admin = {
  auth: () => authInstance,
};

module.exports = { admin, isInitialized };
