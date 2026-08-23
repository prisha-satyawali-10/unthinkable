# Meeting Summarizer

A lightweight and robust web application that transcribes meeting audio and extracts structured, action-oriented intelligence using LLMs.

## Features

- **Audio Ingestion:** Supports `.mp3`, `.wav`, `.m4a`, `.webm`, `.ogg` up to 75MB.
- **ASR Transcription:** Uses Hugging Face Inference API (`openai/whisper-large-v3`) for highly accurate speech-to-text.
- **LLM Intelligence Extraction:** Uses `Qwen/Qwen2.5-7B-Instruct` via Hugging Face to generate an executive summary, key topics, decisions, and action items from the transcript.
- **Modern Frontend:** A clean, responsive single-page application built with vanilla HTML/CSS/JS. No heavy frameworks!

## Architecture

1. **Frontend:** Vanilla HTML/CSS/JS (Single Page Application)
2. **Backend:** Node.js with Express
3. **Storage:** Temporary local storage via Multer for audio processing
4. **AI Services:** Hugging Face Inference API (`@huggingface/inference`) for both ASR and LLM.

## Prerequisites

- Node.js (v14 or higher)
- Hugging Face API Key (Access Token)

## Setup & Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-repo-url>
   cd meeting_summary
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit `.env` and add your Hugging Face API key:
   \`\`\`env
   HUGGINGFACE_API_KEY=your_actual_api_key_here
   PORT=3000
   \`\`\`

4. **Start the server:**
   \`\`\`bash
   npm start
   \`\`\`

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

## Demo Instructions

To test the application:
1. Ensure your `.env` contains a valid Hugging Face API key.
2. Run the server using `npm start`.
3. Open the browser and drag and drop a small meeting recording (.mp3, .wav) into the upload area.
4. Preview the audio and click "Generate Intelligence".
5. Observe the processing states and finally the results dashboard showing Summary, Topics, Decisions, and Action items.
6. Use the "Copy All (Markdown)" button to copy the intelligence output.

## License

MIT
