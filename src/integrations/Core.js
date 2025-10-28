// src/integrations/Core.js

// Upload a file to your backend (stubbed to memory for now)
export async function UploadFile(file, { onProgress } = {}) {
  // Simulate progress so the UI works even without a backend
  if (onProgress) {
    for (let p = 0; p <= 100; p += 20) {
      await new Promise(r => setTimeout(r, 60));
      onProgress(p);
    }
  }
  // Return a pseudo "uploaded" descriptor you can pass around
  return {
    ok: true,
    id: `upl_${Math.random().toString(36).slice(2)}`,
    name: file?.name || "unknown",
    size: file?.size || 0,
    type: file?.type || "application/octet-stream",
    // In a real app, url would be a backend URL
    url: URL.createObjectURL(file || new Blob()),
  };
}

// Extract plain text from a PDF or text-like file on the client (stub).
// Replace with a backend call when ready.
export async function ExtractDataFromUploadedFile(uploadInfo) {
  // If you already have a Blob URL, try to read it
  let text = "";
  try {
    const res = await fetch(uploadInfo.url);
    const blob = await res.blob();
    if (blob.type.startsWith("text/")) {
      text = await blob.text();
    } else {
      // For PDFs or other types, return a placeholder until you add real extraction
      text = `Extracted preview of ${uploadInfo.name} (stub). Replace with real PDF/text extraction.`;
    }
  } catch {
    text = "Failed to read file content (stub).";
  }

  return {
    ok: true,
    name: uploadInfo.name,
    mime: uploadInfo.type,
    size: uploadInfo.size,
    pages: 0,
    text,
    chunks: [],
  };
}

// LLM wrapper (stub) used by Creative/Testing flows
export async function InvokeLLM({ prompt, system = "", maxTokens = 512, temperature = 0.2, signal } = {}) {
  await new Promise(r => setTimeout(r, 600));
  return {
    ok: true,
    model: "stub-llm",
    content: `Stub response for prompt: ${prompt?.slice(0, 120) || ""}...`,
    usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
  };
}

