"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function DocumentUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            toast.success("Document processed and vectorized!");
            setFile(null);
            // Reset file input if needed
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Knowledge Base Upload (RAG)</h2>
                <p className="text-sm opacity-70">Upload PDF or Text files to train the AI coach.</p>

                <div className="form-control w-full max-w-xs">
                    <input
                        type="file"
                        accept=".txt,.pdf,.md"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full max-w-xs"
                    />
                </div>

                <div className="card-actions justify-end mt-4">
                    <button
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? <span className="loading loading-spinner"></span> : "Upload & Vectorize"}
                    </button>
                </div>
            </div>
        </div>
    );
}
