import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";

export async function uploadVehicleImages(params: {
  files: File[];
  firebaseUid: string;
  vehicleTempId?: string;
}) {
  const { files, firebaseUid, vehicleTempId = crypto.randomUUID() } = params;

  const uploadedUrls = await Promise.all(
    files.map(async (file) => {
      const originalName = file.name.replace(/\s+/g, "_");
      const filePath = `vehicles/${firebaseUid}/${vehicleTempId}/${Date.now()}_${originalName}`;

      const storageRef = ref(storage, filePath);

      await uploadBytes(storageRef, file, {
        contentType: file.type || "application/octet-stream",
      });

      return await getDownloadURL(storageRef);
    })
  );

  return uploadedUrls;
}