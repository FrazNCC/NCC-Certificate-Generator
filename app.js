// Certificate Generator Application

// State management
const state = {
  currentTab: 'single',
  currentCertificateData: null,
  csvData: [],
  previewShown: false
};

// Initialize the application
function init() {
  setupEventListeners();
  setDefaultDate();
}

// Setup all event listeners
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
  });

  // Single certificate form
  document.getElementById('singleForm').addEventListener('submit', handlePreview);
  document.getElementById('generatePdfBtn').addEventListener('click', handleGeneratePdf);

  // Bulk certificate
  document.getElementById('downloadCsvBtn').addEventListener('click', downloadSampleCsv);
  document.getElementById('csvFileInput').addEventListener('change', handleCsvUpload);
  document.getElementById('generateBulkBtn').addEventListener('click', handleGenerateBulk);
}

// Set default date to today
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('issueDate').value = today;
}

// Switch between tabs
function switchTab(tabName) {
  state.currentTab = tabName;
  
  // Update tab buttons
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });

  // Update tab content
  document.getElementById('singleTab').classList.toggle('hidden', tabName !== 'single');
  document.getElementById('bulkTab').classList.toggle('hidden', tabName !== 'bulk');
}

// Handle preview for single certificate
function handlePreview(e) {
  e.preventDefault();
  
  const formData = {
    studentName: document.getElementById('studentName').value,
    courseName: document.getElementById('courseName').value,
    lecturerName: document.getElementById('lecturerName').value,
    issueDate: document.getElementById('issueDate').value,
    certificateType: document.getElementById('certificateType').value
  };

  // Validate form
  if (!validateFormData(formData)) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  state.currentCertificateData = formData;
  drawCertificate(formData);
  
  // Show preview section and enable PDF button
  document.getElementById('previewSection').classList.remove('hidden');
  document.getElementById('generatePdfBtn').disabled = false;
  state.previewShown = true;

  // Scroll to preview
  setTimeout(() => {
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Validate form data
function validateFormData(data) {
  return Object.values(data).every(value => value && value.trim() !== '');
}

// Draw certificate on canvas
function drawCertificate(data) {
  const canvas = document.getElementById('certificateCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size for A4 landscape (297mm x 210mm at 96 DPI)
  const scale = 3; // Higher resolution for better quality
  canvas.width = 1122 * scale;
  canvas.height = 794 * scale;
  
  // Scale context for high-res rendering
  ctx.scale(scale, scale);
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1122, 794);

  // Outer border - gold
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, 1062, 734);

  // Inner border - darker gold
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 1032, 704);

  // Decorative corners
  drawDecorativeCorners(ctx);

  // Certificate title
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 52px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Certificate of ${data.certificateType}`, 561, 140);

  // Decorative line under title
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(361, 160);
  ctx.lineTo(761, 160);
  ctx.stroke();

  // "This certifies that" text
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('This certifies that', 561, 240);

  // Student name (prominent)
  ctx.font = 'bold 48px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(data.studentName, 561, 310);

  // Underline for name
  const nameWidth = ctx.measureText(data.studentName).width;
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(561 - nameWidth/2 - 20, 325);
  ctx.lineTo(561 + nameWidth/2 + 20, 325);
  ctx.stroke();

  // "has successfully completed" text
  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText('has successfully completed the course', 561, 390);

  // Course name
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(data.courseName, 561, 450);

  // Underline for course
  const courseWidth = ctx.measureText(data.courseName).width;
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(561 - courseWidth/2 - 20, 465);
  ctx.lineTo(561 + courseWidth/2 + 20, 465);
  ctx.stroke();

  // "under the instruction of" text
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText('under the instruction of', 561, 525);

  // Lecturer name
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(data.lecturerName, 561, 570);

  // Issue date
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  const formattedDate = formatDate(data.issueDate);
  ctx.fillText(`Issued on: ${formattedDate}`, 561, 680);

  // Signature line
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(411, 720);
  ctx.lineTo(711, 720);
  ctx.stroke();

  ctx.font = '16px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText('Authorized Signature', 561, 740);
}

// Draw decorative corners
function drawDecorativeCorners(ctx) {
  const cornerSize = 40;
  const offset = 45;
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(offset + cornerSize, offset);
  ctx.lineTo(offset, offset);
  ctx.lineTo(offset, offset + cornerSize);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(1122 - offset - cornerSize, offset);
  ctx.lineTo(1122 - offset, offset);
  ctx.lineTo(1122 - offset, offset + cornerSize);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(offset, 794 - offset - cornerSize);
  ctx.lineTo(offset, 794 - offset);
  ctx.lineTo(offset + cornerSize, 794 - offset);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(1122 - offset, 794 - offset - cornerSize);
  ctx.lineTo(1122 - offset, 794 - offset);
  ctx.lineTo(1122 - offset - cornerSize, 794 - offset);
  ctx.stroke();
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Generate PDF for single certificate
function handleGeneratePdf() {
  if (!state.currentCertificateData) {
    showToast('Please preview the certificate first', 'error');
    return;
  }

  generatePdfFromData(state.currentCertificateData);
  showToast('Certificate generated successfully!', 'success');
}

// Generate PDF from certificate data
function generatePdfFromData(data) {
  const canvas = document.getElementById('certificateCanvas');
  const imgData = canvas.toDataURL('image/png', 1.0);
  
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Add image to PDF
  pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
  
  // Create filename
  const filename = sanitizeFilename(`${data.courseName}_${data.studentName}.pdf`);
  pdf.save(filename);
}

// Sanitize filename
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9_\-\.]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Download sample CSV
function downloadSampleCsv() {
  const csvContent = [
    ['Student Name', 'Course Name', 'Lecturer Name', 'Issue Date', 'Certificate Type'],
    ['John Smith', 'Advanced JavaScript', 'Dr. Jane Doe', '2025-11-16', 'Achievement'],
    ['Emily Johnson', 'Web Development Fundamentals', 'Prof. Robert Brown', '2025-11-16', 'Completion'],
    ['Michael Chen', 'React Masterclass', 'Dr. Sarah Williams', '2025-11-16', 'Excellence']
  ];

  const csv = csvContent.map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'certificate_template.csv';
  link.click();
  
  showToast('Sample CSV downloaded', 'success');
}

// Handle CSV upload
function handleCsvUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      if (results.errors.length > 0) {
        showToast('Error parsing CSV file', 'error');
        console.error(results.errors);
        return;
      }

      // Validate CSV structure
      const requiredColumns = ['Student Name', 'Course Name', 'Lecturer Name', 'Issue Date', 'Certificate Type'];
      const headers = Object.keys(results.data[0] || {});
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));

      if (missingColumns.length > 0) {
        showToast(`Missing required columns: ${missingColumns.join(', ')}`, 'error');
        return;
      }

      // Validate data
      const validData = results.data.filter(row => {
        return row['Student Name'] && row['Course Name'] && 
               row['Lecturer Name'] && row['Issue Date'] && 
               row['Certificate Type'];
      });

      if (validData.length === 0) {
        showToast('No valid data found in CSV', 'error');
        return;
      }

      state.csvData = validData;
      displayCsvPreview(validData);
      showToast(`${validData.length} certificates ready to generate`, 'success');
    },
    error: function(error) {
      showToast('Error reading CSV file', 'error');
      console.error(error);
    }
  });
}

// Display CSV preview
function displayCsvPreview(data) {
  const tbody = document.getElementById('csvPreviewBody');
  tbody.innerHTML = '';

  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(row['Student Name'])}</td>
      <td>${escapeHtml(row['Course Name'])}</td>
      <td>${escapeHtml(row['Lecturer Name'])}</td>
      <td>${row['Issue Date']}</td>
      <td><span class="status status--info">${escapeHtml(row['Certificate Type'])}</span></td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('certificateCount').textContent = data.length;
  document.getElementById('csvPreviewSection').classList.remove('hidden');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Generate bulk certificates
async function handleGenerateBulk() {
  if (state.csvData.length === 0) {
    showToast('Please upload a CSV file first', 'error');
    return;
  }

  const btn = document.getElementById('generateBulkBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading-spinner"></span>Generating...';
  btn.disabled = true;

  try {
    const zip = new JSZip();
    const { jsPDF } = window.jspdf;

    // Create a temporary canvas for bulk generation
    const tempCanvas = document.createElement('canvas');
    const scale = 3;
    tempCanvas.width = 1122 * scale;
    tempCanvas.height = 794 * scale;

    for (let i = 0; i < state.csvData.length; i++) {
      const row = state.csvData[i];
      const certData = {
        studentName: row['Student Name'],
        courseName: row['Course Name'],
        lecturerName: row['Lecturer Name'],
        issueDate: row['Issue Date'],
        certificateType: row['Certificate Type']
      };

      // Draw certificate on temp canvas
      const ctx = tempCanvas.getContext('2d');
      ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      ctx.save();
      ctx.scale(scale, scale);
      
      // Draw certificate (reusing the same drawing logic)
      drawCertificateOnContext(ctx, certData);
      ctx.restore();

      // Convert to PDF
      const imgData = tempCanvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      
      // Add to ZIP
      const filename = sanitizeFilename(`${certData.courseName}_${certData.studentName}.pdf`);
      const pdfBlob = pdf.output('blob');
      zip.file(filename, pdfBlob);
    }

    // Generate ZIP and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'certificates.zip';
    link.click();

    showToast(`Successfully generated ${state.csvData.length} certificates!`, 'success');
  } catch (error) {
    showToast('Error generating certificates', 'error');
    console.error(error);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// Draw certificate on a given context (for bulk generation)
function drawCertificateOnContext(ctx, data) {
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1122, 794);

  // Outer border - gold
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 12;
  ctx.strokeRect(30, 30, 1062, 734);

  // Inner border - darker gold
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 1032, 704);

  // Decorative corners
  drawDecorativeCorners(ctx);

  // Certificate title
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 52px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Certificate of ${data.certificateType}`, 561, 140);

  // Decorative line under title
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(361, 160);
  ctx.lineTo(761, 160);
  ctx.stroke();

  // "This certifies that" text
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('This certifies that', 561, 240);

  // Student name (prominent)
  ctx.font = 'bold 48px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(data.studentName, 561, 310);

  // Underline for name
  const nameWidth = ctx.measureText(data.studentName).width;
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(561 - nameWidth/2 - 20, 325);
  ctx.lineTo(561 + nameWidth/2 + 20, 325);
  ctx.stroke();

  // "has successfully completed" text
  ctx.font = 'italic 22px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText('has successfully completed the course', 561, 390);

  // Course name
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(data.courseName, 561, 450);

  // Underline for course
  const courseWidth = ctx.measureText(data.courseName).width;
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(561 - courseWidth/2 - 20, 465);
  ctx.lineTo(561 + courseWidth/2 + 20, 465);
  ctx.stroke();

  // "under the instruction of" text
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText('under the instruction of', 561, 525);

  // Lecturer name
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText(data.lecturerName, 561, 570);

  // Issue date
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  const formattedDate = formatDate(data.issueDate);
  ctx.fillText(`Issued on: ${formattedDate}`, 561, 680);

  // Signature line
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(411, 720);
  ctx.lineTo(711, 720);
  ctx.stroke();

  ctx.font = '16px Georgia, serif';
  ctx.fillStyle = '#1a1a2e';
  ctx.fillText('Authorized Signature', 561, 740);
}

// Show toast notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  
  const toast = document.createElement('div');
  toast.className = `toast status status--${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s var(--ease-standard) reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}