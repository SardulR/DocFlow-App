import { useState } from "react";
import {UploadCard} from "@/components/ui/UploadCard";
import {ProcessingCard} from "@/components/ui/ProcessingCard";
import { BackButton } from "../ui/BackButton";  
export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleMerge = async () => {
    setLoading(true);
    try {
      // 🔥 Example API call
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/pdf/split", {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <BackButton />
      <UploadCard onFilesSelected={setFiles} />
      {loading ? (
        <ProcessingCard message="Splitting PDFs..." />
      ) : (
        <button
          disabled={files.length < 2}
          onClick={handleMerge}
          className="btn-primary"
        >
          this is sthe unique page for splitting
        </button>
      )}
    </div>
  );
}
