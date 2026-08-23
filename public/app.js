document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('drop-zone');
  const browseBtn = document.getElementById('browse-btn');
  const audioInput = document.getElementById('audio-input');
  const filePreview = document.getElementById('file-preview');
  const fileNameDisplay = document.getElementById('file-name');
  const audioPlayer = document.getElementById('audio-player');
  const processBtn = document.getElementById('process-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const loadingState = document.getElementById('loading-state');
  const statusText = document.getElementById('status-text');
  const errorMessage = document.getElementById('error-message');
  const resultsDashboard = document.getElementById('results-dashboard');
  const uploadSection = document.getElementById('upload-section');
  const resetBtn = document.getElementById('reset-btn');
  
  // Results Elements
  const summaryText = document.getElementById('summary-text');
  const topicsList = document.getElementById('topics-list');
  const decisionsList = document.getElementById('decisions-list');
  const actionsTableBody = document.querySelector('#actions-table tbody');
  const transcriptText = document.getElementById('transcript-text');
  const copyAllBtn = document.getElementById('copy-all-btn');
  const copyTranscriptBtn = document.getElementById('copy-transcript-btn');

  let selectedFile = null;
  let meetingData = null;

  // File Upload Handlers
  browseBtn.addEventListener('click', () => audioInput.click());

  audioInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-active');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-active');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-active');
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  cancelBtn.addEventListener('click', resetUpload);

  // Demo Logic
  const demoBtn = document.getElementById('demo-btn');
  demoBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('demo.mp3');
      if (!response.ok) throw new Error('Demo file not found');
      
      const blob = await response.blob();
      const demoFile = new File([blob], 'demo.mp3', { type: 'audio/mpeg' });
      handleFile(demoFile);
    } catch (error) {
      showError('Demo file (demo.mp3) not found. Please place it in the public folder.');
    }
  });

  function handleFile(file) {
    errorMessage.classList.add('hidden');
    
    // Validate file type
    const validExtensions = ['.mp3', '.wav', '.m4a', '.webm', '.ogg'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(extension) && !file.type.startsWith('audio/')) {
      showError('Invalid file type. Please upload a supported audio file.');
      return;
    }

    // Validate size (75MB)
    if (file.size > 75 * 1024 * 1024) {
      showError('File size exceeds the 75MB limit.');
      return;
    }

    selectedFile = file;
    fileNameDisplay.textContent = file.name;
    
    // Create object URL for audio preview
    const objectUrl = URL.createObjectURL(file);
    audioPlayer.src = objectUrl;

    dropZone.classList.add('hidden');
    filePreview.classList.remove('hidden');
  }

  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
  }

  function resetUpload() {
    selectedFile = null;
    audioInput.value = '';
    audioPlayer.src = '';
    dropZone.classList.remove('hidden');
    filePreview.classList.add('hidden');
    errorMessage.classList.add('hidden');
    resultsDashboard.classList.add('hidden');
    uploadSection.classList.remove('hidden');
  }

  resetBtn.addEventListener('click', resetUpload);

  // Process Button Handler
  processBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    filePreview.classList.add('hidden');
    loadingState.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    const formData = new FormData();
    formData.append('audio', selectedFile);

    try {
      // Step 1: Upload and Transcribe
      statusText.textContent = "Uploading & transcribing audio...";
      
      const response = await fetch('/api/upload-and-summarize', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'An error occurred during processing.');
      }

      statusText.textContent = "Extracting action items & summary...";
      const result = await response.json();

      if (result.status === 'success') {
        meetingData = result.data;
        displayResults(meetingData);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      loadingState.classList.add('hidden');
      filePreview.classList.remove('hidden');
      showError(error.message);
    }
  });

  function displayResults(data) {
    loadingState.classList.add('hidden');
    uploadSection.classList.add('hidden');
    resultsDashboard.classList.remove('hidden');

    // Summary
    summaryText.textContent = data.summary || 'No summary available.';

    // Topics
    topicsList.innerHTML = '';
    if (data.keyTopics && data.keyTopics.length > 0) {
      data.keyTopics.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = topic;
        topicsList.appendChild(li);
      });
    } else {
      topicsList.innerHTML = '<li>None</li>';
    }

    // Decisions
    decisionsList.innerHTML = '';
    if (data.decisions && data.decisions.length > 0) {
      data.decisions.forEach(decision => {
        const li = document.createElement('li');
        li.textContent = decision;
        decisionsList.appendChild(li);
      });
    } else {
      decisionsList.innerHTML = '<li>No decisions identified.</li>';
    }

    // Actions
    actionsTableBody.innerHTML = '';
    if (data.actionItems && data.actionItems.length > 0) {
      data.actionItems.forEach(item => {
        const tr = document.createElement('tr');
        
        const tdTask = document.createElement('td');
        tdTask.textContent = item.task;
        
        const tdAssignee = document.createElement('td');
        tdAssignee.textContent = item.assignee;
        
        const tdDeadline = document.createElement('td');
        tdDeadline.textContent = item.deadline;
        
        tr.appendChild(tdTask);
        tr.appendChild(tdAssignee);
        tr.appendChild(tdDeadline);
        
        actionsTableBody.appendChild(tr);
      });
    } else {
      actionsTableBody.innerHTML = '<tr><td colspan="3">No action items identified.</td></tr>';
    }

    // Transcript
    transcriptText.textContent = data.transcript || 'No transcript available.';
  }

  // Copy functionalities
  copyTranscriptBtn.addEventListener('click', () => {
    if (meetingData && meetingData.transcript) {
      navigator.clipboard.writeText(meetingData.transcript)
        .then(() => alert('Transcript copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  });

  copyAllBtn.addEventListener('click', () => {
    if (!meetingData) return;
    
    let markdown = `# Meeting Summary\n\n`;
    
    markdown += `## Executive Summary\n${meetingData.summary || 'N/A'}\n\n`;
    
    markdown += `## Key Topics\n`;
    (meetingData.keyTopics || []).forEach(t => markdown += `- ${t}\n`);
    markdown += `\n`;
    
    markdown += `## Decisions Made\n`;
    (meetingData.decisions || []).forEach(d => markdown += `- ${d}\n`);
    markdown += `\n`;
    
    markdown += `## Action Items\n`;
    markdown += `| Task | Assignee | Deadline |\n|---|---|---|\n`;
    (meetingData.actionItems || []).forEach(a => {
      markdown += `| ${a.task} | ${a.assignee} | ${a.deadline} |\n`;
    });
    
    navigator.clipboard.writeText(markdown)
      .then(() => alert('Markdown copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  });
});
