from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from keras.models import load_model
from PIL import Image
import numpy as np
import io
import json
import os

# ==========================================
# 1. KONFIGURASI FLASK
# ==========================================
app = Flask(__name__, 
            template_folder='html',    # HTML diambil dari folder 'html'
            static_folder='.',         # CSS/JS diambil dari folder root
            static_url_path='')        # Supaya link di HTML tidak perlu pakai awalan /static/

CORS(app)

# ==========================================
# 2. LOAD MODEL
# ==========================================
MODEL_PATH = 'models/my_skin_classifier_model.h5'
print(f"🔄 Loading model from: {MODEL_PATH}...")
try:
    model = load_model(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

CLASS_LABELS = ['Dry', 'Normal', 'Oily']  
TARGET_SIZE = (224, 224)

# ==========================================
# 3. FUNGSI PREPROCESSING
# ==========================================
def preprocess_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        image = image.resize(TARGET_SIZE, Image.Resampling.BILINEAR)
        img_array = np.array(image, dtype=np.float32)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        print(f"❌ Error preprocessing: {str(e)}")
        raise

# ==========================================
# 4. ROUTES / HALAMAN WEBSITE
# ==========================================

@app.route('/')
def home():
    # Halaman utama (root)
    return render_template('homepage.html')

# Route Pintar untuk membuka file HTML apa saja
@app.route('/<path:filename>')
def serve_html(filename):
    if filename.endswith('.html'):
        return render_template(filename)
    return "Halaman tidak ditemukan", 404

# ==========================================
# 5. API PREDIKSI
# ==========================================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
             return jsonify({'success': False, 'error': 'Model belum termuat di server'}), 500
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'Empty filename'}), 400
        
        image_bytes = file.read()
        processed_image = preprocess_image(image_bytes)
        predictions = model.predict(processed_image, verbose=0)
        
        predicted_index = np.argmax(predictions[0])
        predicted_class = CLASS_LABELS[predicted_index]
        confidence = float(predictions[0][predicted_index]) * 100
        
        all_probabilities = {
            CLASS_LABELS[i]: round(float(predictions[0][i] * 100), 2)
            for i in range(len(CLASS_LABELS))
        }
        
        return jsonify({
            'success': True,
            'predicted_class': predicted_class,
            'confidence': round(confidence, 2),
            'all_probabilities': all_probabilities
        })
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

# ==========================================
# 6. PENANGANAN ERROR 404 (WAJIB ADA)
# ==========================================
@app.errorhandler(404)
def page_not_found(e):
    # Ambil path yang diminta (misal: /login.html)
    path = request.path.strip('/')
    
    # Coba cari di folder html jika berakhiran .html
    if path.endswith('.html'):
        try:
            return render_template(path)
        except:
            pass # Lanjut ke error message bawah
            
    return f"Halaman '{path}' tidak ditemukan. Pastikan nama file (huruf besar/kecil) benar.", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)