/**
 * Cloudinary Storage Direct Client-Side Uploader
 * 
 * Performs direct secure uploads to Cloudinary via REST.
 * Includes a robust Base64 Data URL fallback for local testing
 * if no Cloudinary keys are supplied in environment variables.
 */
export async function uploadToCloudinary(file: File | string, fileType: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rydr_unsigned";

  if (!cloudName || !cloudName.trim()) {
    console.warn("[Cloudinary] Credentials not configured in .env. Using high-fidelity Base64 Data-URL preview fallback.");
    
    if (file instanceof File) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error("Failed to parse file to Base64."));
        };
        reader.readAsDataURL(file);
      });
    }
    return typeof file === "string" ? file : `/uploads/${fileType}_mock.pdf`;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || "Failed to upload document to Cloudinary cloud.");
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error: any) {
    console.error("[Cloudinary Upload Exception]:", error);
    throw new Error(error.message || "Cloudinary connection timed out.");
  }
}
