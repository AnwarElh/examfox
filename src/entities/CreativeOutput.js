// src/entities/CreativeOutput.js
export class CreativeOutput {
  constructor({
    type = "text",          // "text" | "list" | "mindmap" | "flashcards"
    title = "",
    content = "",
    items = [],
    meta = {},
  } = {}) {
    this.type = type;
    this.title = title;
    this.content = content;
    this.items = items;
    this.meta = meta;
  }

  static fromLLM(resp) {
    // Accepts the object returned by InvokeLLM (or your future real backend)
    const text = resp?.content ?? "";
    return new CreativeOutput({
      type: "text",
      title: "AI Output",
      content: text,
      meta: { model: resp?.model || "unknown" },
    });
  }
}
