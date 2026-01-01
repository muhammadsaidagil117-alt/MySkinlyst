// scan-flask.js - Frontend untuk Flask Backend
// File ini menghubungkan scan.html dengan Flask API

const FLASK_API_URL = 'http://localhost:5000/predict';

// Mapping hasil prediksi ke halaman hasil
const SKIN_TYPE_PAGES = {
  'Dry': 'results-dry.html',
  'Normal': 'results-normal.html',
  'Oily': 'results-oily.html',
};

/**
 * Predict skin type using Flask API
 */
async function predictSkinType(imageFile) {
  try {
    console.log('📤 Uploading image to Flask...');
    
    // Show loading - Step 1: Upload
    showLoading(true, 'Mengunggah gambar...', 1);
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Update loading - Step 2: Analyzing
    setTimeout(() => {
      showLoading(true, 'Menganalisis jenis kulit...', 2);
    }, 300);
    
    // Send request to Flask
    const response = await fetch(FLASK_API_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Prediction failed');
    }
    
    console.log('🎯 Prediction result:', result);
    
    // Save to history
    saveToHistory(result.predicted_class, result.confidence);
    
    // Update loading - Step 3: Success
    showLoading(true, 'Analisis selesai! Mengarahkan...', 3);
    
    // Redirect to result page
    setTimeout(() => {
      redirectToResult(result.predicted_class);
    }, 800);
    
  } catch (error) {
    showLoading(false);
    console.error('❌ Prediction error:', error);
    
    let errorMessage = 'Terjadi kesalahan saat menganalisis gambar.';
    
    if (error.message.includes('Failed to fetch')) {
      errorMessage = `❌ Tidak dapat terhubung ke server!\n\n` +
                    `Pastikan Flask backend sudah berjalan:\n` +
                    `1. Buka terminal/command prompt\n` +
                    `2. cd ke folder project\n` +
                    `3. Aktifkan venv: venv\\Scripts\\activate\n` +
                    `4. Jalankan: python app.py\n\n` +
                    `Server harus running di: ${FLASK_API_URL}`;
    } else {
      errorMessage += '\n\nDetail error: ' + error.message;
    }
    
    alert(errorMessage);
  }
}

/**
 * Save prediction result to localStorage history
 */
function saveToHistory(skinType, confidence) {
  try {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    
    const newEntry = {
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: skinType.charAt(0).toUpperCase() + skinType.slice(1),
      confidence: confidence,
      method: 'scan',
      timestamp: Date.now()
    };
    
    history.unshift(newEntry);
    
    // Keep only last 50 entries
    if (history.length > 50) {
      history.splice(50);
    }
    
    localStorage.setItem('scanHistory', JSON.stringify(history));
    console.log('💾 Saved to history:', newEntry);
  } catch (error) {
    console.warn('⚠️ Failed to save history:', error);
  }
}

/**
 * Redirect to appropriate result page based on skin type
 */
function redirectToResult(skinType) {
  const page = SKIN_TYPE_PAGES[skinType.toLowerCase()] || 'results-normal.html';
  
  // Save current result to sessionStorage
  sessionStorage.setItem('currentSkinType', skinType);
  sessionStorage.setItem('scanTimestamp', Date.now());
  
  console.log('🔄 Redirecting to:', page);
  
  // Redirect
  window.location.href = page;
}

/**
 * Show/hide loading overlay with animation
 */
function showLoading(show, message = 'Menganalisis wajah...', step = 1) {
  let overlay = document.getElementById('loadingOverlay');
  
  if (!overlay) {
    // Create overlay if doesn't exist
    overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="spinner-container">
          <div class="spinner"></div>
          <div class="scanning-line"></div>
        </div>
        <p id="loadingMessage">Menganalisis wajah...</p>
        <div class="loading-steps">
          <span class="step" id="step1">●</span>
          <span class="step" id="step2">●</span>
          <span class="step" id="step3">●</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  
  // Update message
  const messageElement = document.getElementById('loadingMessage');
  if (messageElement) {
    messageElement.textContent = message;
  }
  
  // Update step indicators
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById(`step${i}`);
    if (stepEl) {
      if (i <= step) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('active');
      }
    }
  }
  
  // Show/hide overlay
  overlay.style.display = show ? 'flex' : 'none';
}

/**
 * Initialize scan functionality
 */
function initializeScan() {
  const scanButton = document.getElementById('uploadScanBtn');
  
  if (!scanButton) {
    console.warn('⚠️ Scan button not found on this page');
    return;
  }
  
  // Create hidden file input
  let fileInput = document.getElementById('faceImageInput');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/jpg,image/png';
    fileInput.style.display = 'none';
    fileInput.id = 'faceImageInput';
    document.body.appendChild(fileInput);
  }
  
  // Handle file selection
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('❌ Format file tidak valid!\n\nGunakan format: JPG, JPEG, atau PNG');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('❌ Ukuran file terlalu besar!\n\nMaksimal: 5MB\nUkuran file Anda: ' + 
            (file.size / (1024 * 1024)).toFixed(2) + 'MB');
      return;
    }
    
    console.log('✅ File valid:', file.name, (file.size / 1024).toFixed(2) + 'KB');
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImage = document.getElementById('previewImage');
      if (previewImage) {
        previewImage.src = e.target.result;
        previewImage.classList.add('has-image');
      }
    };
    reader.readAsDataURL(file);
    
    // Start prediction
    await predictSkinType(file);
    
    // Reset input untuk bisa upload file yang sama lagi
    fileInput.value = '';
  });
  
  // Handle button click
  scanButton.addEventListener('click', () => {
    fileInput.click();
  });
  
  console.log('✅ Scan functionality initialized (Flask mode)');
}

/**
 * Check if Flask server is running
 */
async function checkServerHealth() {
  try {
    const healthUrl = FLASK_API_URL.replace('/predict', '/health');
    const response = await fetch(healthUrl);
    const health = await response.json();
    
    console.log('✅ Flask server is healthy:', health);
    return true;
  } catch (error) {
    console.warn('⚠️ Flask server not reachable:', error.message);
    console.warn('📝 Make sure Flask is running: python app.py');
    return false;
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Skinlyst scan page...');
  
  initializeScan();
  
  // Check server health
  const isHealthy = await checkServerHealth();
  
  if (!isHealthy) {
    console.warn('⚠️ Server check failed. Upload will fail if server is not running.');
  }
});

// Add loading overlay styles
const style = document.createElement('style');
style.textContent = `
  #loadingOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(10px);
  }
  
  .loading-content {
    text-align: center;
    color: white;
    padding: 60px 50px;
    background: linear-gradient(135deg, rgba(232, 178, 152, 0.2) 0%, rgba(232, 178, 152, 0.05) 100%);
    border-radius: 30px;
    border: 2px solid rgba(232, 178, 152, 0.3);
    max-width: 450px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }
  
  .spinner-container {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 30px;
  }
  
  .spinner {
    width: 120px;
    height: 120px;
    border: 6px solid rgba(255, 255, 255, 0.1);
    border-top-color: #e8b298;
    border-right-color: #e8b298;
    border-radius: 50%;
    animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  }
  
  .scanning-line {
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      #e8b298 50%, 
      transparent 100%);
    box-shadow: 0 0 10px #e8b298;
    animation: scan 2s ease-in-out infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes scan {
    0%, 100% { 
      transform: translateY(-40px);
      opacity: 0;
    }
    50% { 
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .loading-content p {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 20px;
    line-height: 1.4;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  .loading-steps {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 25px;
  }
  
  .loading-steps .step {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }
  
  .loading-steps .step.active {
    color: #e8b298;
    font-size: 16px;
    text-shadow: 0 0 10px #e8b298;
  }
`;
document.head.appendChild(style);

// Export functions for external use
export { predictSkinType, initializeScan, checkServerHealth };