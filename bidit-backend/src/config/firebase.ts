import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

const serviceAccountPath = join(
  process.cwd(),
  "serviceAccountKey.json"
);

const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

console.log("🔥 Firebase Admin connected");

export { admin };