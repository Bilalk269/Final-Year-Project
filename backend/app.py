from flask import Flask, request, jsonify
from flask_cors import CORS
from controllers.find_similar_controller import find_similar
from controllers.sketch_controller import sketch
from controllers.text_generation_controller import generate_text_controller
from PIL import Image, ImageEnhance, ImageFilter
import io
import base64

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return {"message": "Welcome to the Sketch-Based Image Retrieval API"}, 200

@app.route('/find_similar', methods=['POST'])
def find_similar_endpoint():
    return find_similar()

@app.route('/sketch', methods=['POST'])
def sketch_endpoint():
    return sketch()

@app.route('/generate_text', methods=['POST'])
def generate_text_endpoint():
    return generate_text_controller()

@app.route('/edit_image', methods=['POST'])
def edit_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Get editing parameters with defaults
        brightness = float(request.form.get('brightness', 1.0))
        contrast = float(request.form.get('contrast', 1.0))
        grayscale = request.form.get('grayscale', 'false').lower() == 'true'
        sepia = request.form.get('sepia', 'false').lower() == 'true'
        blur = float(request.form.get('blur', 0))
        
        # Open and process image
        img = Image.open(file.stream)
        
        # Apply grayscale if requested
        if grayscale:
            img = img.convert('L')
        
        # Apply sepia effect if requested
        if sepia:
            sepia_filter = Image.new('RGB', img.size, (255, 240, 192))
            img = Image.blend(img.convert('RGB'), sepia_filter, 0.2)
        
        # Apply blur if requested
        if blur > 0:
            img = img.filter(ImageFilter.GaussianBlur(blur))
        
        # Adjust brightness and contrast
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(brightness)
        
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(contrast)
        
        # Prepare response
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        return jsonify({
            "edited_image": f"data:image/png;base64,{img_str}"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')