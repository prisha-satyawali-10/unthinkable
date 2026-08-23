const fs = require('fs');
const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Transcribe audio file using Hugging Face's inference API (Whisper)
 * @param {string} filePath - Path to the audio file
 * @returns {Promise<string>} - The transcription text
 */
async function transcribeAudio(filePath) {
  try {
    const path = require('path');
    const ext = path.extname(filePath).toLowerCase();
    
    // Determine mime type based on extension
    let mimeType = 'audio/mpeg';
    if (ext === '.wav') mimeType = 'audio/wav';
    else if (ext === '.webm') mimeType = 'audio/webm';
    else if (ext === '.ogg') mimeType = 'audio/ogg';
    else if (ext === '.m4a') mimeType = 'audio/x-m4a';

    const audioData = fs.readFileSync(filePath);
    
    // The HF client expects a Blob for certain providers
    const audioBlob = new Blob([audioData], { type: mimeType });

    const transcription = await hf.automaticSpeechRecognition({
      model: 'openai/whisper-large-v3',
      data: audioBlob
    });
    return transcription.text;
  } catch (error) {
    console.error('ASR Service Error:', error);
    throw new Error('Failed to transcribe audio.');
  }
}

module.exports = {
  transcribeAudio
};
