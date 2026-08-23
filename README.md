# 🎙️ Meeting Summarizer

A lightweight and robust web application that transcribes meeting audio and extracts structured, action-oriented intelligence using LLMs — turning raw recordings into executive summaries, key topics, decisions, and action items in seconds.

**🔗 Live Demo:** [meetingsummary-alpha.vercel.app](https://meetingsummary-alpha.vercel.app/)

**🎥 Video Demonstration:** [https://drive.google.com/file/d/1jk-4A_qWL6HlKiVGGfv09XJ_u12kmLX6/view?usp=sharing]

---

## ✨ Features

- **🎧 Audio Ingestion** — Supports `.mp3`, `.wav`, `.m4a`, `.webm`, and `.ogg` files up to 75MB, with drag-and-drop upload and in-browser preview.
- **📝 ASR Transcription** — Uses the Hugging Face Inference API (`openai/whisper-large-v3`) for highly accurate speech-to-text.
- **🧠 LLM Intelligence Extraction** — Uses `Qwen/Qwen2.5-7B-Instruct` via Hugging Face to generate:
  - An executive summary
  - Key discussion topics
  - Decisions made
  - Action items
- **📋 One-Click Export** — Copy the full intelligence output as clean Markdown with a single click.
- **💻 Modern Frontend** — A clean, responsive single-page application built with vanilla HTML/CSS/JS. No heavy frameworks, no bloat.

---

## 🏗️ Architecture

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML / CSS / JS (SPA) |
| Backend | Node.js + Express |
| Storage | Temporary local storage via Multer for audio processing |
| AI Services | Hugging Face Inference API (`@huggingface/inference`) for both ASR and LLM |

**Flow:** Audio upload → Multer temp storage → Whisper-large-v3 transcription → Qwen2.5-7B-Instruct intelligence extraction → Structured results dashboard.

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- A [Hugging Face API Key](https://huggingface.co/settings/tokens) (Access Token)

---

## 🚀 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd meeting_summary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Hugging Face API key:
   ```env
   HUGGINGFACE_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demo Instructions

To test the application locally:

1. Ensure your `.env` contains a valid Hugging Face API key.
2. Run the server with `npm start`.
3. Open the browser and drag and drop a small meeting recording (`.mp3`, `.wav`, etc.) into the upload area.
4. Preview the audio, then click **"Generate Intelligence"**.
5. Watch the processing states resolve into a results dashboard showing the Summary, Topics, Decisions, and Action Items.
6. Use the **"Copy All (Markdown)"** button to copy the full intelligence output.

Prefer not to set anything up locally? Try the [live demo](https://meetingsummary-alpha.vercel.app/) instead.

---

## 📄 License

MIT
