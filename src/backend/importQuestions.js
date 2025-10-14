// src/backend/importQuestions.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase service account
import serviceAccount from "./serviceaccountkey.json" assert { type: "json" };

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load questions JSON
const questionsPath = path.join(__dirname, "topquest.json");
const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

// Firestore collection name
const collectionName = "dsaQuestions";

async function importData() {
  try {
    const batch = db.batch();

    questions.forEach((q) => {
      const docRef = db.collection(collectionName).doc(q.id.toString());
      batch.set(docRef, q);
    });

    await batch.commit();
    console.log("✅ All questions imported successfully!");
  } catch (err) {
    console.error("❌ Error importing questions:", err);
  }
}

importData();
