const { HfInference } = require('@huggingface/inference');
const { SYSTEM_PROMPT } = require('../utils/prompts');

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Extract structured information from the transcript using LLM
 * @param {string} transcript - The raw meeting transcript
 * @returns {Promise<Object>} - The structured JSON data
 */
async function extractMeetingIntelligence(transcript) {
  try {
    let out = '';
    for await (const chunk of hf.chatCompletionStream({
      model: 'Qwen/Qwen2.5-72B-Instruct', 
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcript }
      ],
      max_tokens: 1500,
      temperature: 0.2,
    })) {
      if (chunk.choices && chunk.choices.length > 0) {
        out += chunk.choices[0].delta.content || '';
      }
    }

    // Clean up markdown formatting if the model still includes it
    let content = out.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (content.startsWith('```')) {
      content = content.replace(/^```/, '').replace(/```$/, '').trim();
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('LLM Service Error:', error);
    throw new Error('Failed to extract meeting intelligence.');
  }
}

module.exports = {
  extractMeetingIntelligence
};
