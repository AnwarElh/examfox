// Minimal domain model used by Testing.jsx
export class Quiz {
  constructor({
    id = randomId(),
    title = "Untitled Quiz",
    questions = [], // [{ id, type: 'mcq'|'tf'|'short', prompt, choices:[], answer }]
    meta = {},
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
  } = {}) {
    this.id = id;
    this.title = title;
    this.questions = questions;
    this.meta = meta;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  addQuestion(q) {
    this.questions.push({ id: randomId(), ...q });
    this.touch();
  }

  touch() {
    this.updatedAt = new Date().toISOString();
  }
}

function randomId() {
  try {
    return Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

export default Quiz;
