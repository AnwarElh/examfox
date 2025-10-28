// src/entities/Document.js

// Simple domain model for uploaded/studied documents
export class Document {
  constructor({
    id = cryptoRandomId(),
    title = "",
    filename = "",
    mime = "application/pdf",
    size = 0,                 // bytes
    pages = 0,
    text = "",                // full extracted text (optional)
    chunks = [],              // [{ id, text, embeddingId }]
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    meta = {},                // e.g., course, subject, tags
    status = "ready",         // "ready" | "processing" | "failed"
  } = {}) {
    this.id = id;
    this.title = title || filename || "Untitled";
    this.filename = filename;
    this.mime = mime;
    this.size = size;
    this.pages = pages;
    this.text = text;
    this.chunks = chunks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.meta = meta;
    this.status = status;
  }

  rename(newTitle) {
    this.title = newTitle;
    this.touch();
  }

  setProcessing() {
    this.status = "processing";
    this.touch();
  }

  setFailed(reason = "") {
    this.status = "failed";
    this.meta.error = reason;
    this.touch();
  }

  setReady() {
    this.status = "ready";
    this.touch();
  }

  addChunk(chunk) {
    // chunk: { id, text, embeddingId }
    this.chunks.push(chunk);
    this.touch();
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }
}

// Small helper for ids without adding deps
function cryptoRandomId() {
  try {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
