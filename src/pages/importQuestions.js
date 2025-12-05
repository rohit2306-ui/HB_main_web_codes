const admin = require("firebase-admin");
const fs = require("fs");

// Firebase service account config
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Read local JSON
const questions = JSON.parse(fs.readFileSync("questions.json", "utf8"));

// Collection name
const collectionName = "dsaQuestions";

async function importData() {
  const batch = db.batch();

  questions.forEach((q) => {
    const docRef = db.collection(collectionName).doc(q.id.toString());
    batch.set(docRef, q);
  });

  await batch.commit();
  console.log("✅ Questions imported successfully!");
}

importData().catch(console.error);
