interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY) {
      throw new Error("Cloudinary API key is missing");
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    ); // your upload preset name
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
    ); // your cloud name
    formData.append(
      "api_key",
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || ""
    );

    // Upload directly to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dxqhf3yuw/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error:", errorData);
      throw new Error(errorData.error?.message || "Image upload failed");
    }

    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
