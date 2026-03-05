import { useState } from "react";
import { uploadVehicleImage } from "../../../firebase/uploadVehicleImage";

export default function VehicleImageUpload() {
  const [url, setUrl] = useState<string>("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadVehicleImage(file, "testVehicle123");
    setUrl(result.url);
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} />

      {url && (
        <div style={{ marginTop: 12 }}>
          <img src={url} alt="vehicle" width={300} />
        </div>
      )}
    </div>
  );
}