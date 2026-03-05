import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadVehicleImage(file: File, vehicleId: string) {
  const fileRef = ref(
    storage,
    `vehicles/${vehicleId}/${crypto.randomUUID()}-${file.name}`
  );

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  return { url, path: fileRef.fullPath };
}