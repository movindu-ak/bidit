import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!admin.apps.length) {
  // Path: apps/api/serviceAccountKey.json
  // Adjust if your file is elsewhere
  const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });

  console.log("🔥 Firebase Admin connected");
}

export default admin;