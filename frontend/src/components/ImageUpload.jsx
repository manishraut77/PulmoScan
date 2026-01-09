import React, { useRef, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function UploadImage({
  userId,
  onUploadComplete,
  onUploadStart,
  onUploadError,
}) {
  const inputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  function handleFileChange(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      setImageFile(null);
      setMessage("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setImageFile(null);
      setMessage("Please select an image file.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Removed size limit message earlier, but this block existed. Keeping structure minimal.
    setImageFile(file);
    setMessage("");
  }

  async function handleUpload() {
    if (!imageFile) {
      setMessage("Please select an image first.");
      return;
    }
    if (!userId) {
      setMessage("Missing userId. Can't upload.");
      return;
    }

    setUploading(true);
    setMessage("");
    if (onUploadStart) onUploadStart();

    // Create a unique file name
    const fileName = `${userId}-${Date.now()}-${imageFile.name}`;

    // Upload image to Supabase Storage bucket
    const upload = await supabase.storage.from("xray-images").upload(fileName, imageFile);

    if (upload.error) {
      const errorMessage = "Upload failed: " + upload.error.message;
      setMessage(errorMessage);
      setUploading(false);
      if (onUploadError) onUploadError(errorMessage);
      return;
    }

    // Get the public URL of uploaded image
    const url = supabase.storage.from("xray-images").getPublicUrl(fileName);
    const imagePath = url.data.publicUrl;

    // NEW: Insert record into public.scans table
    const insert = await supabase
      .from("scans")
      .insert([{ user_id: userId, image_path: imagePath }])
      .select("id")
      .single();

    if (insert.error) {
      const errorMessage = "DB insert failed: " + insert.error.message;
      setMessage(errorMessage);
      setUploading(false);
      if (onUploadError) onUploadError(errorMessage);
      return;
    }

    const scanId = insert.data.id;
    console.log("Inserted scan record with ID:", scanId);

    setMessage("");
    setUploading(false);
    setImageFile(null);

    // Reset the file input UI
    if (inputRef.current) inputRef.current.value = "";

    // Notify parent component with the uploaded image URL
    if (onUploadComplete) onUploadComplete(imagePath, scanId);
  }

  const disabledUpload = uploading || !imageFile;

  const styles = {
    wrap: { marginTop: 8 },

    // clean row, no boxes
    row: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      flexWrap: "wrap",
    },

    // hide the native input (the ugly part)
    hiddenInput: {
      position: "absolute",
      left: -9999,
      width: 1,
      height: 1,
      opacity: 0,
      pointerEvents: "none",
    },

    // “Choose image / selected filename” pill
    pickBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 8,
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid #EEF2F7",
      background: "#FFFFFF",
      color: "#0F172A",
      fontWeight: 800,
      fontSize: 14,
      cursor: uploading ? "not-allowed" : "pointer",
      boxShadow: "0 8px 18px rgba(15, 23, 42, 0.06)",
      userSelect: "none",
      width: 260,
      maxWidth: "100%",
    },

    fileName: {
      color: "#0F172A",
      fontWeight: 800,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      display: "block",
      width: "100%",
    },

    // primary upload button
    uploadBtn: (disabled) => ({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 16px",
      borderRadius: 12,
      border: "1px solid #0F172A",
      background: "#0F172A",
      color: "#FFFFFF",
      fontWeight: 900,
      fontSize: 14,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.55 : 1,
      boxShadow: "0 10px 18px rgba(15, 23, 42, 0.10)",
      whiteSpace: "nowrap",
    }),

    // message: keep it clean, not boxed
    message: {
      marginTop: 10,
      color: "#334155",
      fontWeight: 700,
      fontSize: 14,
      lineHeight: 1.45,
    },
  };

  return (
    <div style={styles.wrap}>
      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={styles.hiddenInput}
      />

      <div style={styles.row}>
        {/* Custom “Choose image / filename” */}
        <button
          type="button"
          onClick={() => inputRef.current && inputRef.current.click()}
          disabled={uploading}
          style={styles.pickBtn}
        >
          {imageFile ? (
            <span style={styles.fileName}>{imageFile.name}</span>
          ) : (
            "Choose Image"
          )}
        </button>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={disabledUpload}
          style={styles.uploadBtn(disabledUpload)}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
}
